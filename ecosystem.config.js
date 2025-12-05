module.exports = {
    apps: [
        {
            name: 'blog-backend',
            script: './backend/dist/index.js',
            env: {
                NODE_ENV: 'production',
                PORT: 5000,
                // 请在服务器上设置以下环境变量，或在此处取消注释并修改
                // DATABASE_URL: "file:./dev.db",
                // JWT_SECRET: "your-secret-key-change-this-in-production"
            },
            watch: false,
            instances: 1,
            exec_mode: 'fork'
        }
    ]
}
