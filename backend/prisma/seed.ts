import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 开始初始化数据库...')

    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: { role: 'SUPER_ADMIN' },
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: '博主',
            bio: '热爱技术，热爱生活',
            role: 'SUPER_ADMIN'
        }
    })

    console.log('✅ 管理员用户已创建:', admin.email)

    // 创建标签
    const tags = ['React', 'TypeScript', 'Node.js', 'Python', 'DevOps', '生活随笔']

    for (const tagName of tags) {
        await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: {
                name: tagName,
                slug: tagName.toLowerCase().replace(/[.\s]+/g, '-')
            }
        })
    }

    console.log('✅ 标签已创建')

    // 创建示例文章
    const reactTag = await prisma.tag.findUnique({ where: { name: 'React' } })
    const tsTag = await prisma.tag.findUnique({ where: { name: 'TypeScript' } })

    const posts = [
        {
            title: '欢迎来到我的博客',
            slug: 'welcome-to-my-blog',
            content: `
        <h2>你好，世界！</h2>
        <p>欢迎访问我的个人博客。这里是我记录技术学习心得、分享开源项目和生活感悟的地方。</p>
        <h3>关于这个博客</h3>
        <p>本博客使用以下技术栈构建：</p>
        <ul>
          <li><strong>前端</strong>：React + TypeScript + Vite</li>
          <li><strong>后端</strong>：Node.js + Express + Prisma</li>
          <li><strong>数据库</strong>：SQLite</li>
        </ul>
        <p>希望这里的内容能对你有所帮助！</p>
      `,
            excerpt: '欢迎访问我的个人博客，这里是我记录技术学习心得和生活感悟的地方。',
            coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
            published: true
        },
        {
            title: 'React 18 新特性详解',
            slug: 'react-18-new-features',
            content: `
        <h2>React 18 带来了什么</h2>
        <p>React 18 是一个重大更新，引入了许多令人兴奋的新特性。</p>
        <h3>并发特性</h3>
        <p>并发渲染允许 React 在后台准备新的 UI，而不阻塞主线程。</p>
        <h3>自动批处理</h3>
        <p>React 18 自动将多个状态更新合并为单次渲染，提升性能。</p>
        <pre><code>
// 这些更新会被自动批处理
setCount(c => c + 1);
setFlag(f => !f);
        </code></pre>
        <h3>Suspense 改进</h3>
        <p>服务端渲染中的 Suspense 支持使得流式渲染成为可能。</p>
      `,
            excerpt: 'React 18 引入了并发特性、自动批处理和改进的 Suspense 支持，让应用更快更流畅。',
            coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
            published: true
        }
    ]

    for (const postData of posts) {
        const existingPost = await prisma.post.findUnique({
            where: { slug: postData.slug }
        })

        if (!existingPost) {
            await prisma.post.create({
                data: {
                    ...postData,
                    authorId: admin.id,
                    tags: {
                        connect: [
                            reactTag ? { id: reactTag.id } : undefined,
                            tsTag ? { id: tsTag.id } : undefined
                        ].filter(Boolean) as { id: number }[]
                    }
                }
            })
        }
    }

    console.log('✅ 示例文章已创建')
    console.log('🎉 数据库初始化完成！')
    console.log('')
    console.log('📝 管理员账号:')
    console.log('   邮箱: admin@example.com')
    console.log('   密码: admin123')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
