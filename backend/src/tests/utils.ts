import prisma from '../utils/prisma.js'

export const resetDb = async () => {
    // Delete in order of foreign key constraints
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()
    await prisma.tag.deleteMany()
}

export const createTestUser = async (overrides = {}) => {
    return await prisma.user.create({
        data: {
            name: 'TestUser',
            email: `test-${Date.now()}@example.com`,
            password: 'hashedpassword123', // In real tests, relying on endpoint to hash, but for seeding need valid hash if testing login with seeded user
            role: 'USER',
            ...overrides
        }
    })
}
