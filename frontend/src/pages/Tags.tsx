import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTags } from '../services/api'
import './Tags.css'

interface Tag {
    id: number
    name: string
    slug: string
    _count: {
        posts: number
    }
}

// Random color classes for tags
const tagColorClasses = ['tag-green', 'tag-cyan', 'tag-pink', 'tag-yellow', 'tag-white']

function Tags() {
    const [tags, setTags] = useState<Tag[]>([])
    const [loading, setLoading] = useState(true)
    const isLoggedIn = !!localStorage.getItem('token')

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await getTags()
                setTags(data)
            } catch (error) {
                console.error('获取标签失败:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTags()
    }, [])

    return (
        <div className="tags-page">
            <header className="page-header">
                <h1 className="page-title">标签云</h1>
                <p className="page-desc">
                    {isLoggedIn ? '你的文章标签' : '按标签浏览文章'}
                </p>
            </header>

            {loading ? (
                <div className="tags-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="skeleton tag-skeleton"></div>
                    ))}
                </div>
            ) : tags.length > 0 ? (
                <div className="tags-cloud">
                    {tags.map((tag, index) => (
                        <Link
                            key={tag.id}
                            to={`/tag/${tag.slug}`}
                            className={`tag-item hover-trigger ${tagColorClasses[index % tagColorClasses.length]}`}
                        >
                            <span className="tag-name">{tag.name}</span>
                            <span className="tag-count">{tag._count.posts}</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>// 暂无标签</p>
                </div>
            )}
        </div>
    )
}

export default Tags
