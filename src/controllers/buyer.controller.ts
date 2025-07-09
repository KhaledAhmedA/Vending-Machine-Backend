import { Request, Response } from 'express';
import User from '../models/user.model';
import Product from '../models/product.model';
import { AuthRequest } from '../middleware/auth.middleware';

const VALID_COINS = [5, 10, 20, 50, 100];

// POST /deposit
export const deposit = async (req: AuthRequest, res: Response) => {
    const { coin } = req.body;

    if (!VALID_COINS.includes(coin)) {
        return res.status(400).json({ message: 'Invalid coin. Must be 5, 10, 20, 50, or 100' });
    }

    const user = await User.findByIdAndUpdate(
        req.user!.id,
        { $inc: { deposit: coin } },
        { new: true }
    );

    res.json({ deposit: user?.deposit });
};

// POST /reset
export const resetDeposit = async (req: AuthRequest, res: Response) => {
    const user = await User.findByIdAndUpdate(
        req.user!.id,
        { deposit: 0 },
        { new: true }
    );

    res.json({ deposit: user?.deposit });
};

// Helper to calculate change coins
const getChangeCoins = (change: number): number[] => {
    const result: number[] = [];
    for (const coin of VALID_COINS.sort((a, b) => b - a)) {
        while (change >= coin) {
            change -= coin;
            result.push(coin);
        }
    }
    return result;
};

// POST /buy
export const buyProduct = async (req: AuthRequest, res: Response) => {
    const { productId, amount } = req.body;

    if (!amount || amount < 1) {
        return res.status(400).json({ message: 'Amount must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.amountAvailable < amount) {
        return res.status(400).json({ message: 'Not enough product in stock' });
    }

    const user = await User.findById(req.user!.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const totalCost = product.cost * amount;
    if (user.deposit < totalCost) {
        return res.status(400).json({ message: 'Insufficient deposit' });
    }

    const change = user.deposit - totalCost;

    // Update product stock and user deposit
    product.amountAvailable -= amount;
    await product.save();

    user.deposit = 0;
    await user.save();

    res.json({
        totalSpent: totalCost,
        // product: product.productName,
        product: {
            productName: product.productName,
            cost: product.cost,
            amountPurchased: amount
        },
        quantity: amount,
        change: getChangeCoins(change)
    });
};



export const getDeposit = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ deposit: user.deposit });
    } catch (err) {
        console.error('Get deposit error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
