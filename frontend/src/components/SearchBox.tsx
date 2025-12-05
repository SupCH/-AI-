import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchBox.css'

interface SearchResult {
    id: number
    title: string
    slug: string
    excerpt: string | null
    tags: { id: number; name: string; slug: string }[]
}

function SearchBox() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    // 搜索防抖
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
                const data = await res.json()
                setResults(data)
            } catch (error) {
                console.error('搜索失败:', error)
            }
            setLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + K 打开搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
                inputRef.current?.focus()
            }
            // ESC 关闭
            if (e.key === 'Escape') {
                setIsOpen(false)
                setQuery('')
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleResultClick = (slug: string) => {
        setIsOpen(false)
        setQuery('')
        navigate(`/post/${slug}`)
    }

    return (
        <div className="search-box" ref={searchRef}>
            <button
                className="search-trigger hover-trigger"
                onClick={() => {
                    setIsOpen(true)
                    setTimeout(() => inputRef.current?.focus(), 100)
                }}
            >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="search-shortcut">Ctrl+K</span>
            </button>

            {isOpen && (
                <div className="search-modal">
                    <div className="search-input-wrapper">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-input"
                            placeholder="搜索文章..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button className="search-close" onClick={() => setIsOpen(false)}>
                            ESC
                        </button>
                    </div>

                    <div className="search-results">
                        {loading && (
                            <div className="search-loading">// 搜索中...</div>
                        )}

                        {!loading && query && results.length === 0 && (
                            <div className="search-empty">// 未找到相关文章</div>
                        )}

                        {!loading && results.map((result) => (
                            <div
                                key={result.id}
                                className="search-result-item"
                                onClick={() => handleResultClick(result.slug)}
                            >
                                <h4 className="result-title">{result.title}</h4>
                                {result.excerpt && (
                                    <p className="result-excerpt">{result.excerpt.slice(0, 80)}...</p>
                                )}
                                {result.tags.length > 0 && (
                                    <div className="result-tags">
                                        {result.tags.slice(0, 3).map(tag => (
                                            <span key={tag.id} className="result-tag">#{tag.name}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {!query && (
                            <div className="search-hint">
                                <p>// 输入关键词搜索文章</p>
                                <p className="hint-tip">提示：支持搜索标题和内容</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBox
