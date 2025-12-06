import './About.css'

function About() {
    const skills = [
        { name: 'TypeScript', color: 'tag-cyan' },
        { name: 'React', color: 'tag-cyan' },
        { name: 'Node.js', color: 'tag-green' },
        { name: 'Python', color: 'tag-yellow' },
        { name: 'Docker', color: 'tag-pink' },
        { name: 'PostgreSQL', color: 'tag-white' },
    ]

    return (
        <div className="about-page">
            {/* Contact Section - Matching reference style */}
            <section className="contact-section">
                <div className="contact-bg">MAIL</div>

                <h2 className="contact-title">
                    <span className="title-highlight">🤖 致谢</span> AI大佬们
                </h2>
                <p className="ai-thanks">
                    本站由 <strong>Gemini</strong> 和 <strong>Claude</strong> 联合打造！<br />
                    没有这两位"码农界的ChatGPT"，博主可能还在复制粘贴Stack Overflow...<br />
                    <span className="glitch-text" data-text="// 人类只是提出需求的工具人">// 人类只是提出需求的工具人</span>
                </p>
            </section>

            {/* Skills Section */}
            <section className="skills-section">
                <h3 className="skills-title">技术栈</h3>
                <div className="skills-list">
                    {skills.map((skill) => (
                        <span key={skill.name} className={`skill-tag ${skill.color}`}>
                            {skill.name}
                        </span>
                    ))}
                </div>
            </section>

            {/* Social Links */}
            <section className="social-section">
                <a href="https://github.com/SupCH/Neo-Brutalist-AI-" target="_blank" rel="noopener noreferrer" className="social-link hover-trigger">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    GitHub
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link hover-trigger">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                    Twitter
                </a>
                <a href="mailto:contact@example.com" className="social-link hover-trigger">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Email
                </a>
            </section>
        </div>
    )
}

export default About
