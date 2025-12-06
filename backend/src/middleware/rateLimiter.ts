import rateLimit from 'express-rate-limit'

// 通用 API 限流：15分钟内最多 100 次请求
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        error: '请求过于频繁，请稍后再试。'
    },
    skip: () => process.env.NODE_ENV === 'test' // 测试环境跳过限流
})

// 认证接口限流：15分钟内最多 5 次尝试（防止暴力破解）
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: '登录/注册尝试次数过多，请 15 分钟后再试。'
    },
    skip: () => process.env.NODE_ENV === 'test' // 测试环境跳过限流
})
