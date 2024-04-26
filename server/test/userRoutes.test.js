const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Assurez-vous que c'est le bon chemin
const router = require('../routes/userRoutes');
const sequelize = require('../models/database');
const { Deserializer } = require('v8');

describe('User Routes', () => {
    // Reset database table User after tests
    after(async () => {
        await sequelize.query('DELETE FROM Users');
    });


    describe('POST /register', () => {
        it('should return 201 status code', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            assert.strictEqual(response.statusCode, 201);
        });

        it ('should return 400 status code', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    username: 'aa'
                });
            assert.strictEqual(response.statusCode, 400);
        });
    });

    describe('POST /login', () => {
        it('should return 200 status code', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            assert.strictEqual(response.statusCode, 200);
        });

        it('should return 404 status code', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });
            assert.strictEqual(response.statusCode, 401);
        });
    }
    );
});
