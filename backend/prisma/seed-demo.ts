import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// 随机中文名生成
const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴']
const names = ['小明', '小红', '大伟', '静怡', '浩然', '雨婷', '子轩', '欣怡', '梓涵', '思远']

function randomName() {
    return surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)]
}

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// 随机文章标题
const titleTemplates = [
    '我对{}的一些思考',
    '{}入门指南',
    '为什么我选择了{}',
    '{}的最佳实践',
    '从零开始学习{}',
    '{}踩坑记录',
    '{}使用心得分享',
    '深入理解{}',
    '{}项目实战经验',
    '关于{}的二三事'
]

const topics = [
    'React', 'Vue', 'TypeScript', 'Node.js', 'Python', 'Go语言',
    '前端开发', '后端架构', '数据库优化', '微服务', 'Docker',
    '机器学习', '开源项目', '代码重构', '团队协作', '远程办公',
    '个人成长', '读书笔记', '生活随笔', '旅行见闻'
]

function randomTitle() {
    const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
    const topic = topics[Math.floor(Math.random() * topics.length)]
    return template.replace('{}', topic)
}

// 随机文章内容
function randomContent() {
    const paragraphs = [
        '这是一段关于技术的思考。在当今快速发展的互联网时代，我们需要不断学习新知识来保持竞争力。',
        '经过几个月的实践，我总结了一些经验教训，希望对大家有所帮助。',
        '## 核心概念\n\n首先，让我们来了解一些基础概念。这些概念是后续学习的基石。',
        '## 实战案例\n\n下面通过一个具体的例子来说明如何应用这些知识。',
        '```javascript\nconst hello = "world";\nconsole.log(hello);\n```',
        '> 学习是一个持续的过程，保持好奇心是最重要的。',
        '### 小结\n\n通过本文的学习，希望大家对这个话题有了更深入的理解。',
        '如果你有任何问题，欢迎在评论区留言讨论！',
        '最后，感谢你花时间阅读这篇文章。如果觉得有帮助，欢迎点赞收藏。'
    ]

    const count = randomInt(3, 6)
    const selected = []
    for (let i = 0; i < count; i++) {
        selected.push(paragraphs[Math.floor(Math.random() * paragraphs.length)])
    }
    return selected.join('\n\n')
}

// 随机评论内容
const commentTemplates = [
    '写得很好，学到了！',
    '感谢分享，正好需要这方面的知识',
    '请问有没有更详细的教程？',
    '太棒了，已收藏',
    '博主辛苦了，期待更多内容',
    '这个方法我试过，确实有效',
    '有个小问题想请教一下...',
    '正是我需要的，谢谢！',
    '讲得很清楚，新手友好',
    '催更！期待下一篇',
    '已经按照文章实践了，效果不错',
    '能出个视频教程吗？',
    '干货满满！',
    '作为过来人，深有同感',
    '这个观点很新颖，学习了'
]

async function main() {
    console.log('🌱 开始生成测试数据...\n')

    const hashedPassword = await bcrypt.hash('user123', 10)

    // 获取现有标签
    const tags = await prisma.tag.findMany()
    if (tags.length === 0) {
        console.log('⚠️ 没有找到标签，请先运行 seed.ts 初始化基础数据')
        return
    }

    // 创建 8 个用户 (UID 2-9)
    const users = []
    for (let i = 2; i <= 9; i++) {
        const name = `${randomName()}${i}`
        const user = await prisma.user.upsert({
            where: { email: `user${i}@example.com` },
            update: {},
            create: {
                email: `user${i}@example.com`,
                password: hashedPassword,
                name: name,
                bio: `我是${name}，这是我的个人博客。`,
                role: 'USER'
            }
        })
        users.push(user)
        console.log(`✅ 用户 ${user.name} (UID:${user.id}) 已创建`)
    }

    // 为每个用户创建 3-6 篇文章
    let totalPosts = 0
    let totalComments = 0

    for (const user of users) {
        const postCount = randomInt(3, 6)

        for (let p = 0; p < postCount; p++) {
            const title = randomTitle()
            const slug = `post-${user.id}-${p}-${Date.now()}`

            // 随机选择 1-3 个标签
            const selectedTags = []
            const tagCount = randomInt(1, 3)
            for (let t = 0; t < tagCount; t++) {
                const tag = tags[Math.floor(Math.random() * tags.length)]
                if (!selectedTags.find(st => st.id === tag.id)) {
                    selectedTags.push(tag)
                }
            }

            const post = await prisma.post.create({
                data: {
                    title,
                    slug,
                    content: randomContent(),
                    excerpt: title + ' - 这是一篇关于技术和生活的分享文章。',
                    published: true,
                    isPublic: true,
                    authorId: user.id,
                    views: randomInt(10, 500), // 随机阅读量
                    tags: {
                        connect: selectedTags.map(t => ({ id: t.id }))
                    }
                }
            })
            totalPosts++

            // 为每篇文章创建 1-20 条评论
            const commentCount = randomInt(1, 20)
            for (let c = 0; c < commentCount; c++) {
                // 随机选择一个用户作为评论者 (包括原作者和管理员)
                const allUserIds = [1, ...users.map(u => u.id)] // 1 是管理员
                const commenterId = allUserIds[Math.floor(Math.random() * allUserIds.length)]

                await prisma.comment.create({
                    data: {
                        content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
                        postId: post.id,
                        authorId: commenterId
                    }
                })
                totalComments++
            }
        }
        console.log(`   📝 ${user.name}: ${postCount} 篇文章已创建`)
    }

    // 生成过去 7 天的访问统计数据
    console.log('\n📊 生成访问趋势数据...')
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        await prisma.dailyStat.upsert({
            where: { date: dateStr },
            update: {
                views: randomInt(50, 500),
                visitors: randomInt(20, 150)
            },
            create: {
                date: dateStr,
                views: randomInt(50, 500),
                visitors: randomInt(20, 150)
            }
        })
    }

    console.log('\n🎉 测试数据生成完成！')
    console.log(`   👥 创建用户: ${users.length} 个`)
    console.log(`   📝 创建文章: ${totalPosts} 篇`)
    console.log(`   💬 创建评论: ${totalComments} 条`)
    console.log(`   📈 访问趋势: 最近 7 天`)
    console.log('\n📝 测试账号密码统一为: user123')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
