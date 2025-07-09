import request from 'supertest';
// import app from '../src/app';
import mongoose from 'mongoose';
import userModel from '../models/user.model';
import app from '../app';
// import User from '../src/models/user.model';

let token = '';

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/vending_test');
    await userModel.deleteMany({});

    await request(app).post('/api/users/register').send({
        username: 'myself',
        password: '123456',
        role: 'buyer',
    });

    const res = await request(app).post('/api/users/login').send({
        username: 'myself',
        password: '123456',
    });

    token = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('GET /account/me', () => {
    it('returns user data without password', async () => {
        const res = await request(app)
            .get('/api/account/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.username).toBe('myself');
        expect(res.body.password).toBeUndefined();
    });
});

describe('PUT /account/me', () => {
    it('updates user password', async () => {
        const res = await request(app)
            .put('/api/account/me')
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 'newpass123' });

        expect(res.status).toBe(200);
        expect(res.body.username).toBe('myself');
    });
});

describe('DELETE /account/me', () => {
    it('deletes the user', async () => {
        const res = await request(app)
            .delete('/api/account/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User deleted successfully');
    });
});
