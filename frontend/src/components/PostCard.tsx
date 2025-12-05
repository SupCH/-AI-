import { Link } from 'react-router-dom'
import './PostCard.css'

export interface Post {
    id: number
    title: string
    slug: string
    excerpt: string
    coverImage?: string
    createdAt: string
    author: {
        name: string
        avatar?: string
    }
    tags: Array<{
        id: number
        name: string
        slug: string
    }>
}

interface PostCardProps {
    post: Post
    featured?: boolean
}

// Color palette for category tags
const tagColors: Record<string, string> = {
    'tech': 'tag-green',
    'life': 'tag-cyan',
    'design': 'tag-pink',
    'code': 'tag-white',
    'music': 'tag-yellow',
}

function getTagColorClass(tagName: string): string {
    const normalized = tagName.toLowerCase()
    return tagColors[normalized] || 'tag-green'
}

function PostCard({ post }: PostCardProps) {
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-CA') // YYYY-MM-DD format

    return (
        <article className="post-card card-hover hover-trigger">
            <div className="post-card-content">
                {/* Header: Category + Date */}
                <div className="post-card-header">
                    {post.tags.length > 0 && (
                        <Link
                            to={`/tag/${post.tags[0].slug}`}
                            className={`post-card-tag ${getTagColorClass(post.tags[0].name)}`}
                        >
                            {post.tags[0].name}
                        </Link>
                    )}
                    <time className="post-card-date">{formattedDate}</time>
                </div>

                {/* Title */}
                <h3 className="post-card-title">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="post-card-excerpt">{post.excerpt}</p>
            </div>

            {/* Read More Link */}
            <Link to={`/post/${post.slug}`} className="post-card-link">
                阅读全文
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </Link>
        </article>
    )
}

export default PostCard
