import { useState, useEffect } from 'react'
import './TableOfContents.css'

interface TocItem {
    id: string
    text: string
    level: number
}

interface Props {
    content: string
}

function TableOfContents({ content }: Props) {
    const [tocItems, setTocItems] = useState<TocItem[]>([])
    const [activeId, setActiveId] = useState<string>('')

    // 解析内容中的标题
    useEffect(() => {
        // 匹配 Markdown 标题 (# ## ### 等) 或 HTML 标题 (<h1>, <h2> 等)
        const headingRegex = /^(#{1,6})\s+(.+)$|<h([1-6])[^>]*>(.+?)<\/h\3>/gm
        const items: TocItem[] = []
        let match

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1] ? match[1].length : parseInt(match[3])
            const text = (match[2] || match[4]).replace(/<[^>]+>/g, '').trim()
            const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                .replace(/^-|-$/g, '')

            if (level >= 2 && level <= 4) { // 只包含 h2-h4
                items.push({ id, text, level })
            }
        }

        setTocItems(items)
    }, [content])

    // 监听滚动，高亮当前section
    useEffect(() => {
        if (tocItems.length === 0) return

        const handleScroll = () => {
            const headings = tocItems.map(item => document.getElementById(item.id))
            const scrollPosition = window.scrollY + 100

            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i]
                if (heading && heading.offsetTop <= scrollPosition) {
                    setActiveId(tocItems[i].id)
                    return
                }
            }
            setActiveId(tocItems[0]?.id || '')
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // 初始化

        return () => window.removeEventListener('scroll', handleScroll)
    }, [tocItems])

    // 给文章内容添加id
    useEffect(() => {
        if (tocItems.length === 0) return

        // 延迟执行，确保内容已渲染
        setTimeout(() => {
            const container = document.querySelector('.post-content')
            if (!container) return

            const headings = container.querySelectorAll('h2, h3, h4')
            headings.forEach((heading) => {
                const text = heading.textContent || ''
                const id = text
                    .toLowerCase()
                    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                    .replace(/^-|-$/g, '')
                heading.id = id
            })
        }, 100)
    }, [tocItems])

    const handleClick = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 80 // header高度
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    const [isOpen, setIsOpen] = useState(false)

    if (tocItems.length < 2) return null // 标题太少则不显示目录

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                className={`toc-toggle hover-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="文章目录"
            >
                <span className="toc-icon">📑</span>
            </button>

            {/* TOC Popup */}
            <nav className={`table-of-contents ${isOpen ? 'open' : ''}`}>
                <div className="toc-header">
                    <span className="toc-title">目录导航</span>
                    <button className="toc-close" onClick={() => setIsOpen(false)}>×</button>
                </div>
                <ul className="toc-list">
                    {tocItems.map((item, index) => (
                        <li
                            key={`${item.id}-${index}`}
                            className={`toc-item toc-level-${item.level} ${activeId === item.id ? 'active' : ''}`}
                        >
                            <button
                                className="toc-link hover-trigger"
                                onClick={() => {
                                    handleClick(item.id)
                                    // setIsOpen(false) // Optional: close on click
                                }}
                            >
                                <span className="toc-marker">//</span>
                                {item.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}

export default TableOfContents
