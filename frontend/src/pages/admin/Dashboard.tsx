import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats, getAnalytics } from '../../services/api'
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
    const [analytics, setAnalytics] = useState<Array<{ date: string, views: number, visitors: number }>>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [data, analyticsData] = await Promise.all([
                    getDashboardStats(),
                    getAnalytics()
                ])
                setStats(data)
                setAnalytics(analyticsData || [])
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

            {/* Visitor Stats */}
            <section className="stats-section">
                <div className="section-header">
                    <h2 className="section-title">访问趋势 (近7天)</h2>
                </div>
                <div className="analytics-chart-container">
                    {loading ? (
                        <div className="skeleton" style={{ height: '200px' }}></div>
                    ) : analytics.length > 0 ? (
                        <div className="analytics-chart-wrapper">
                            <div className="analytics-chart">
                                {analytics.map(day => {
                                    const maxViews = Math.max(...analytics.map(d => d.views), 5)
                                    const heightPercent = Math.max((day.views / maxViews) * 100, 5)
                                    return (
                                        <div key={day.date} className="chart-column">
                                            <div className="bar-wrapper" title={`${day.date}\n浏览量: ${day.views}\n访客数: ${day.visitors}`}>
                                                <div className="bar-fill" style={{ height: `${heightPercent}%` }}>
                                                    <span className="bar-value">{day.views}</span>
                                                </div>
                                            </div>
                                            <span className="bar-date">{day.date.slice(5)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            {/* 折线图叠加层 - 累计增长趋势 */}
                            <svg className="line-chart-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <polyline
                                    className="trend-line"
                                    fill="none"
                                    stroke="#fbbf24"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={(() => {
                                        // 计算累计值
                                        let cumulative = 0
                                        const cumulativeData = analytics.map(day => {
                                            cumulative += day.views
                                            return cumulative
                                        })
                                        const maxCumulative = Math.max(...cumulativeData, 1)
                                        return cumulativeData.map((value, index) => {
                                            const x = (index / (analytics.length - 1 || 1)) * 100
                                            const y = 100 - (value / maxCumulative) * 100
                                            return `${x},${y}`
                                        }).join(' ')
                                    })()}
                                />
                            </svg>
                        </div>
                    ) : (
                        <p className="empty-message">// 暂无访问数据</p>
                    )}
                </div>
            </section>

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
