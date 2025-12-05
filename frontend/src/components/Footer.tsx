import { useState, useEffect } from 'react'
import './Footer.css'

function Footer() {
    const [time, setTime] = useState('')
    const currentYear = new Date().getFullYear()

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString('en-US', { hour12: false }))
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <h4 className="footer-logo">DEV.LOG</h4>
                        <p className="footer-desc">
                            Build with ❤️ and ☕.<br />
                            No cookies. No tracking.<br />
                            Just raw React & Express.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="footer-links">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover-trigger">
                            &gt;&gt; Twitter / X
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover-trigger">
                            &gt;&gt; GitHub
                        </a>
                        <a href="/rss" className="hover-trigger">
                            &gt;&gt; RSS Feed
                        </a>
                    </div>

                    {/* System Time Column */}
                    <div className="footer-time">
                        <p className="time-display">{time}</p>
                        <p className="time-label">SYSTEM TIME</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    © {currentYear} MY BRUTALIST BLOG. ALL RIGHTS RESERVED.
                </div>
            </div>
        </footer>
    )
}

export default Footer
