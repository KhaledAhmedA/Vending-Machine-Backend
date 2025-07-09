import request from 'supertest';
import app from '../app';
import userModel from '../models/user.model';
import mongoose from 'mongoose';
// import app from '../src/app';
// import User from '../src/models/user.model';

let token = '';

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/vending_test');
    await userModel.deleteMany({});

    await request(app).post('/api/users/register').send({
        username: 'buyer1',
        password: '123456',
        role: 'buyer'
    });

    const res = await request(app).post('/api/users/login').send({
        username: 'buyer1',
        password: '123456'
    });

    token = res.body.token;
});

describe('Buyer endpoints', () => {
    it('deposits coins', async () => {
        const res = await request(app)
            .post('/api/deposit')
            .set('Authorization', `Bearer ${token}`)
            .send({ coin: 50 });

        expect(res.status).toBe(200);
        expect(res.body.deposit).toBe(50);
    });

    it('gets remaining deposit', async () => {
        const res = await request(app)
            .get('/api/deposit')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.deposit).toBe(50);
    });

    it('resets deposit', async () => {
        const res = await request(app)
            .post('/api/reset')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.deposit).toBe(0);
    });
});
