import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeAll(async () => {
    // Ensure we are not connected to production db accidentally
    // Ideally, we should check process.env.DATABASE_URL
    console.log('Starting tests...')
})

afterAll(async () => {
    await prisma.$disconnect()
})

export default prisma
