import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PostCard, { Post } from '../components/PostCard'
import { getTagPosts } from '../services/api'
import './TagPosts.css'

function TagPosts() {
    const { slug } = useParams<{ slug: string }>()
    const [posts, setPosts] = useState<Post[]>([])
    const [tagName, setTagName] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            if (!slug) return
            try {
                const data = await getTagPosts(slug)
                setPosts(data.posts)
                setTagName(data.tagName)
            } catch (error) {
                console.error('获取标签文章失败:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [slug])

    return (
        <div className="tag-posts container">
            <header className="page-header">
                <span className="tag-badge"># {tagName || slug}</span>
                <h1 className="page-title">标签文章</h1>
                <p className="page-desc">共 {posts.length} 篇文章</p>
            </header>

            {loading ? (
                <div className="posts-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="post-skeleton">
                            <div className="skeleton" style={{ height: '200px' }}></div>
                            <div className="skeleton" style={{ height: '24px', marginTop: '16px', width: '60%' }}></div>
                        </div>
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <div className="posts-grid">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>该标签下暂无文章</p>
                </div>
            )}
        </div>
    )
}

export default TagPosts
