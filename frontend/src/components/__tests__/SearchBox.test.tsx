import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchBox from '../SearchBox'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn()

describe('SearchBox', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const renderWithRouter = (component: React.ReactNode) => {
        return render(<BrowserRouter>{component}</BrowserRouter>)
    }

    it('renders search button initially', () => {
        renderWithRouter(<SearchBox />)
        expect(screen.getByRole('button')).toBeInTheDocument()
        // Check for search icon/text (e.g. shortcut hint)
        expect(screen.getByText('Ctrl+K')).toBeInTheDocument()
    })

    it('opens search input when button is clicked', () => {
        renderWithRouter(<SearchBox />)
        const button = screen.getByRole('button')
        fireEvent.click(button)
        expect(screen.getByPlaceholderText('搜索文章...')).toBeInTheDocument()
    })

    it('searches and displays results', async () => {
        renderWithRouter(<SearchBox />)

        // Open search
        fireEvent.click(screen.getByRole('button'))

        const input = screen.getByPlaceholderText('搜索文章...')

        // Mock API response
        const mockResults = [
            { id: 1, title: 'Test Post', slug: 'test-post', excerpt: 'Test excerpt', tags: [] }
        ]

            ; (global.fetch as any).mockResolvedValueOnce({
                json: async () => mockResults
            })

        // Type query
        fireEvent.change(input, { target: { value: 'test' } })

        // Wait for debounce and fetch
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/posts/search?q=test'))
        })

        // Verify results displayed
        expect(await screen.findByText('Test Post')).toBeInTheDocument()
    })

    it('shows empty state when no results found', async () => {
        renderWithRouter(<SearchBox />)
        fireEvent.click(screen.getByRole('button'))
        const input = screen.getByPlaceholderText('搜索文章...')

            ; (global.fetch as any).mockResolvedValueOnce({
                json: async () => []
            })

        fireEvent.change(input, { target: { value: 'nothing' } })

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled()
        })

        expect(await screen.findByText('// 未找到相关文章')).toBeInTheDocument()
    })
})
