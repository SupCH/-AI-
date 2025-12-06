import { useState, useEffect } from 'react'
import './Footer.css'

interface IpInfo {
    ip: string
    location: string
}

function Footer() {
    const [time, setTime] = useState('')
    const [ipInfo, setIpInfo] = useState<IpInfo | null>(null)
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

    // 获取IP地址和地理位置
    useEffect(() => {
        const fetchIpInfo = async () => {
            try {
                // 使用后端API获取IP和位置信息（解决HTTPS混合内容问题）
                const apiBase = window.location.hostname === 'localhost'
                    ? 'http://localhost:5000'
                    : ''
                const response = await fetch(`${apiBase}/api/ip`)
                const data = await response.json()

                if (data.ip) {
                    setIpInfo({
                        ip: data.ip,
                        location: data.location || '未知位置'
                    })
                }
            } catch (error) {
                console.error('获取IP信息失败:', error)
                setIpInfo({
                    ip: '获取失败',
                    location: '未知位置'
                })
            }
        }

        fetchIpInfo()
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
                            Just raw React &amp; Express.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="footer-links">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover-trigger">
                            &gt;&gt; Twitter / X
                        </a>
                        <a href="https://github.com/SupCH/-AI-" target="_blank" rel="noopener noreferrer" className="hover-trigger">
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

                    {/* IP Info Column */}
                    <div className="footer-ip">
                        <p className="ip-label">本机IP</p>
                        <p className="ip-address">{ipInfo?.ip || '检测中...'}</p>
                        <p className="ip-location">{ipInfo?.location || '定位中...'}</p>
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
