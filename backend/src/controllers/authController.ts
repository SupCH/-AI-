import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma.js'

export const authController = {
    // 用户登录 - Neo-Brutalist Style
    // 支持使用邮箱或UID登录
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    error: true,
                    message: '// MISSING CREDENTIALS',
                    details: 'Email/UID and password required for authentication'
                })
            }

            // 判断是UID还是邮箱登录
            const isUid = /^\d+$/.test(email)
            let user

            if (isUid) {
                // 使用UID登录
                user = await prisma.user.findUnique({
                    where: { id: parseInt(email) }
                })
            } else {
                // 使用邮箱登录
                user = await prisma.user.findUnique({
                    where: { email }
                })
            }

            if (!user) {
                return res.status(401).json({
                    error: true,
                    message: '// ACCESS DENIED',
                    details: 'Invalid credentials'
                })
            }

            const isValidPassword = await bcrypt.compare(password, user.password)

            if (!isValidPassword) {
                return res.status(401).json({
                    error: true,
                    message: '// ACCESS DENIED',
                    details: 'Invalid credentials'
                })
            }

            const secret = process.env.JWT_SECRET || 'default-secret'
            const token = jwt.sign(
                { userId: user.id },
                secret,
                { expiresIn: '7d' }
            )

            res.json({
                success: true,
                message: '// ACCESS GRANTED',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role
                },
                expiresIn: '7 days'
            })
        } catch (error) {
            console.error('// LOGIN ERROR:', error)
            res.status(500).json({
                error: true,
                message: '// SYSTEM MALFUNCTION',
                details: 'Authentication service unavailable'
            })
        }
    },

    // 用户注册
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body

            if (!name || !email || !password) {
                return res.status(400).json({
                    error: true,
                    message: '// MISSING DATA',
                    details: 'Name, email and password are required'
                })
            }

            if (password.length < 6) {
                return res.status(400).json({
                    error: true,
                    message: '// WEAK PASSWORD',
                    details: 'Password must be at least 6 characters'
                })
            }

            // 检查邮箱是否已存在
            const existingUser = await prisma.user.findUnique({
                where: { email }
            })

            if (existingUser) {
                return res.status(400).json({
                    error: true,
                    message: '// USER EXISTS',
                    details: 'This email is already registered'
                })
            }

            // 加密密码
            const hashedPassword = await bcrypt.hash(password, 10)

            // 创建用户
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword
                }
            })

            // 生成 token
            const secret = process.env.JWT_SECRET || 'default-secret'
            const token = jwt.sign(
                { userId: user.id },
                secret,
                { expiresIn: '7d' }
            )

            res.status(201).json({
                success: true,
                message: '// USER CREATED',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar
                }
            })
        } catch (error) {
            console.error('// REGISTER ERROR:', error)
            res.status(500).json({
                error: true,
                message: '// SYSTEM MALFUNCTION',
                details: 'Registration service unavailable'
            })
        }
    }
}
