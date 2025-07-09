import request from 'supertest';
import productModel from '../models/product.model';
import app from '../app';
import userModel from '../models/user.model';
import mongoose from 'mongoose';
// import app from '../src/app';
// import User from '../src/models/user.model';
// import Product from '../src/models/product.model';

let token = '';
let productId = '';

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/vending_test');
    await userModel.deleteMany({});
    await productModel.deleteMany({});

    await request(app).post('/api/users/register').send({
        username: 'seller1',
        password: '123456',
        role: 'seller',
    });

    const res = await request(app).post('/api/users/login').send({
        username: 'seller1',
        password: '123456',
    });

    token = res.body.token;
});

describe('Product CRUD', () => {
    it('creates a product', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productName: 'Coke',
                cost: 100,
                amountAvailable: 10,
            });

        expect(res.status).toBe(201);
        expect(res.body.productName).toBe('Coke');
        productId = res.body._id;
    });

    it('gets all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('updates a product', async () => {
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ cost: 80 });

        expect(res.status).toBe(200);
        expect(res.body.cost).toBe(80);
    });

    it('deletes a product', async () => {
        const res = await request(app)
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Product deleted');
    });
});
