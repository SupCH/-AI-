import './Skeleton.css'

interface SkeletonProps {
    type?: 'text' | 'title' | 'avatar' | 'image' | 'card' | 'button'
    width?: string | number
    height?: string | number
    className?: string
    lines?: number
}

function Skeleton({
    type = 'text',
    width,
    height,
    className = '',
    lines = 1
}: SkeletonProps) {

    const style = {
        width: width,
        height: height
    }

    if (type === 'text' && lines > 1) {
        return (
            <div className={`skeleton-group ${className}`}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className="skeleton skeleton-text"
                        style={{
                            width: i === lines - 1 ? '60%' : '100%',
                            ...style
                        }}
                    />
                ))}
            </div>
        )
    }

    return (
        <div
            className={`skeleton skeleton-${type} ${className}`}
            style={style}
        >
            <div className="skeleton-shimmer"></div>
        </div>
    )
}

export default Skeleton
