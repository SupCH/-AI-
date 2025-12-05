import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../../services/api'
import './Dashboard.css'

interface Stats {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalTags: number
    totalComments: number
    recentPosts: Array<{
        id: number
        title: string
        slug: string
        createdAt: string
    }>
}

function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats()
                setStats(data)
            } catch (error) {
                console.error('获取统计数据失败:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statCards = [
        { label: '总文章', value: stats?.totalPosts || 0, color: 'stat-green', link: '/admin/posts' },
        { label: '已发布', value: stats?.publishedPosts || 0, color: 'stat-cyan', link: '/admin/posts?status=published' },
        { label: '草稿', value: stats?.draftPosts || 0, color: 'stat-yellow', link: '/admin/posts?status=draft' },
        { label: '标签', value: stats?.totalTags || 0, color: 'stat-pink', link: '/tags' },
    ]

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1 className="dashboard-title">
                    <span className="title-prefix">&gt;_</span> 控制面板
                </h1>
                <Link to="/admin/posts/new" className="btn btn-primary hover-trigger">
                    + 新建文章
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="stat-card skeleton"></div>
                    ))
                ) : (
                    statCards.map((stat, index) => (
                        <Link key={index} to={stat.link} className={`stat-card ${stat.color} hover-trigger`}>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </Link>
                    ))
                )}
            </div>

            {/* Recent Posts */}
            <section className="recent-section">
                <div className="section-header">
                    <h2 className="section-title">最近文章</h2>
                </div>

                <div className="recent-list">
                    {loading ? (
                        <div className="skeleton" style={{ height: '200px' }}></div>
                    ) : stats?.recentPosts?.length ? (
                        stats.recentPosts.map(post => (
                            <div key={post.id} className="recent-item">
                                <Link to={`/admin/posts/${post.id}/edit`} className="recent-title hover-trigger">
                                    {post.title}
                                </Link>
                                <span className="recent-date">
                                    {new Date(post.createdAt).toLocaleDateString('en-CA')}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">// 暂无文章数据</p>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Dashboard
