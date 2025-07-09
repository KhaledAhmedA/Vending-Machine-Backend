import request from 'supertest';
// import app from '../src/app';
import mongoose from 'mongoose';
// import User from '../src/models/user.model';
import app from '../app';

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/vending_test');
});

// afterAll(async () => {

//     if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
//         await mongoose.connection.db.dropDatabase();
//         await mongoose.disconnect();
//     }

//     // await mongoose.connection.db.dropDatabase();
// });


afterAll(async () => {
    if (mongoose.connection.readyState > 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
});


describe('Auth API', () => {
    it('registers a new user', async () => {
        const res = await request(app).post('/api/users/register').send({
            username: 'testbuyer',
            password: '123456',
            role: 'buyer',
        });
        expect(res.status).toBe(201);
    });

    it('logs in the user', async () => {
        const res = await request(app).post('/api/users/login').send({
            username: 'testbuyer',
            password: '123456',
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});
