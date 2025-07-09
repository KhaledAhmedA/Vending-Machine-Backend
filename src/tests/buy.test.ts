import request from 'supertest';
// import app from '../src/app';
import mongoose from 'mongoose';
import userModel from '../models/user.model';
import productModel from '../models/product.model';
import app from '../app';
// import User from '../src/models/user.model';
// import Product from '../src/models/product.model';

let token = '';
let productId = '';

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/vending_test');
    await userModel.deleteMany({});
    await productModel.deleteMany({});

    // Register buyer
    await request(app).post('/api/users/register').send({
        username: 'buyerUser',
        password: '123456',
        role: 'buyer',
    });

    // Login buyer
    const res = await request(app).post('/api/users/login').send({
        username: 'buyerUser',
        password: '123456',
    });
    token = res.body.token;

    // Deposit coins (100 + 50 = 150)
    await request(app)
        .post('/api/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({ coin: 100 });
    await request(app)
        .post('/api/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({ coin: 50 });

    // Create product as seller
    await request(app).post('/api/users/register').send({
        username: 'sellerUser',
        password: '123456',
        role: 'seller',
    });

    const sellerLogin = await request(app).post('/api/users/login').send({
        username: 'sellerUser',
        password: '123456',
    });

    const createProduct = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${sellerLogin.body.token}`)
        .send({
            productName: 'Water',
            cost: 60, // buyer pays 150, expect 30 change
            amountAvailable: 10,
        });

    productId = createProduct.body._id;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('POST /buy', () => {
    it('buys a product and returns correct change', async () => {
        const res = await request(app)
            .post('/api/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId,
                amount: 2, // 2 x 60 = 120
            });

        expect(res.status).toBe(200);
        expect(res.body.totalSpent).toBe(120);
        expect(res.body.product.productName).toBe('Water');

        // 150 - 120 = 30
        expect(res.body.change).toEqual(expect.arrayContaining([20, 10]));
    });
});
