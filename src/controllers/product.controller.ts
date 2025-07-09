// import { Request, Response } from 'express';
// import Product from '../models/product.model';
// import { AuthRequest } from '../middleware/auth.middleware';

// // GET /products (public)
// export const getProducts = async (_req: Request, res: Response) => {
//     const products = await Product.find().populate('sellerId', 'username');
//     res.json(products);
// };

// // POST /products (seller only)
// export const createProduct = async (req: AuthRequest, res: Response) => {
//     try {
//         const { productName, cost, amountAvailable } = req.body;

//         if (cost % 5 !== 0) {
//             return res.status(400).json({ message: 'Cost must be divisible by 5' });
//         }

//         const product = await Product.create({
//             productName,
//             cost,
//             amountAvailable,
//             sellerId: req.user!.id,
//         });

//         res.status(201).json(product);
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // PUT /products/:id (seller owns product)
// export const updateProduct = async (req: AuthRequest, res: Response) => {
//     try {
//         const product = await Product.findById(req.params.id);

//         if (!product) return res.status(404).json({ message: 'Product not found' });
//         if (product.sellerId.toString() !== req.user!.id)
//             return res.status(403).json({ message: 'Unauthorized' });

//         const updates = req.body;
//         if (updates.cost && updates.cost % 5 !== 0) {
//             return res.status(400).json({ message: 'Cost must be divisible by 5' });
//         }

//         const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
//         res.json(updated);
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // DELETE /products/:id (seller owns product)
// export const deleteProduct = async (req: AuthRequest, res: Response) => {
//     try {
//         const product = await Product.findById(req.params.id);

//         if (!product) return res.status(404).json({ message: 'Product not found' });
//         if (product.sellerId.toString() !== req.user!.id)
//             return res.status(403).json({ message: 'Unauthorized' });

//         await product.deleteOne();
//         res.json({ message: 'Product deleted' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };





import { Request, Response } from 'express';
import Product from '../models/product.model';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /products (public)
export const getProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().populate('sellerId', 'username');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /products (seller only)
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productName, cost, amountAvailable } = req.body;

        if (cost % 5 !== 0) {
            res.status(400).json({ message: 'Cost must be divisible by 5' });
            return;
        }

        const product = await Product.create({
            productName,
            cost,
            amountAvailable,
            sellerId: req.user!.id,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /products/:id (seller owns product)
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        if (product.sellerId.toString() !== req.user!.id) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        const updates = req.body;
        if (updates.cost && updates.cost % 5 !== 0) {
            res.status(400).json({ message: 'Cost must be divisible by 5' });
            return;
        }

        const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /products/:id (seller owns product)
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        if (product.sellerId.toString() !== req.user!.id) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
