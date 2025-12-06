import sharp from 'sharp'

interface ImageOptions {
    width?: number
    quality?: number
}

export const optimizeImage = async (
    buffer: Buffer,
    options: ImageOptions = {}
): Promise<Buffer> => {
    const { width = 1920, quality = 80 } = options

    try {
        const transformer = sharp(buffer)
        const metadata = await transformer.metadata()

        // 只有当宽度大于设定值时才缩放
        if (metadata.width && metadata.width > width) {
            transformer.resize(width)
        }

        // 转换为 WebP 格式并压缩
        return await transformer
            .webp({ quality, effort: 6 }) // effort: 0-6, 6 is slowest but best compression
            .toBuffer()
    } catch (error) {
        console.error('Image optimization failed:', error)
        throw new Error('Image optimization failed')
    }
}
