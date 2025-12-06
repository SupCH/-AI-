import request from 'supertest'
import app from '../index.js'
import prisma from '../utils/prisma.js'
import { resetDb } from './utils.js'

describe('Auth API', () => {
    beforeAll(async () => {
        await resetDb()
    })

    afterAll(async () => {
        await resetDb()
    })

    describe('POST /api/auth/register', () => {
        afterEach(async () => {
            await resetDb()
        })

        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'NewUser',
                    email: 'newuser@example.com',
                    password: 'password123'
                })

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('token')
            expect(res.body.user).toHaveProperty('email', 'newuser@example.com')

            // Verify db
            const user = await prisma.user.findUnique({ where: { email: 'newuser@example.com' } })
            expect(user).toBeTruthy()
        })

        it('should fail with invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'BadEmail',
                    email: 'invalid-email',
                    password: 'password123'
                })

            expect(res.statusCode).toBe(400)
        })

        it('should fail if email already exists', async () => {
            // Create first user
            await request(app).post('/api/auth/register').send({
                name: 'User1',
                email: 'exists@example.com',
                password: 'password123'
            })

            // Try create second with same email
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'User2',
                    email: 'exists@example.com',
                    password: 'password123'
                })

            expect(res.statusCode).toBe(400)
            expect(res.body.error).toBe(true)
        })
    })

    describe('POST /api/auth/login', () => {
        // Each login test sets up its own user to avoid reset conflicts

        it('should login successfully with correct credentials', async () => {
            // Setup: register a user
            await request(app).post('/api/auth/register').send({
                name: 'LoginUser1',
                email: 'login1@example.com',
                password: 'password123'
            })

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login1@example.com',
                    password: 'password123'
                })

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('token')

            // Cleanup
            await resetDb()
        })

        it('should fail with incorrect password', async () => {
            // Setup: register a user
            await request(app).post('/api/auth/register').send({
                name: 'LoginUser2',
                email: 'login2@example.com',
                password: 'password123'
            })

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login2@example.com',
                    password: 'wrongpassword'
                })

            expect(res.statusCode).toBe(401)

            // Cleanup
            await resetDb()
        })

        it('should fail with non-existent email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nobody@example.com',
                    password: 'password123'
                })

            expect(res.statusCode).toBe(401)
        })
    })
})
