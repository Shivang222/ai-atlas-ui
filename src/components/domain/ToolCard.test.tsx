import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToolCard } from '../../components/domain/ToolCard';
import type { ToolDto } from '../../types';

// Mock lucide-react icons to avoid SVG rendering issues in jsdom
vi.mock('lucide-react', () => ({
    ExternalLink: () => <span data-testid="icon-external-link" />,
    Star: () => <span data-testid="icon-star" />,
    Activity: () => <span data-testid="icon-activity" />,
    ArrowUpRight: () => <span data-testid="icon-arrow-up-right" />,
}));

const mockTool: ToolDto = {
    id: 'test-uuid-1234',
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'Conversational AI assistant by OpenAI',
    websiteUrl: 'https://chat.openai.com',
    githubUrl: null,
    logoUrl: null,
    pricingModel: 'FREEMIUM',
    status: 'ACTIVE',
    // Flat category fields (matches Java ToolDto)
    primaryCategory: 'CODE_GENERATION',
    allCategories: ['CODE_GENERATION', 'PRODUCTIVITY'],
    // Flat intelligence score fields (matches Java ToolDto)
    adoptionScore: 0.9,
    trendingScore: 8.5,
    githubStars: 120000,
    githubForks: 4500,
    // Live counters
    viewCount: 1000,
    clickCount: 250,
    // Timestamps
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    relevanceScore: null,
};

function renderWithRouter(ui: React.ReactElement) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ToolCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders tool name', () => {
        renderWithRouter(<ToolCard tool={mockTool} />);
        expect(screen.getByText('ChatGPT')).toBeInTheDocument();
    });

    it('renders tool description', () => {
        renderWithRouter(<ToolCard tool={mockTool} />);
        expect(screen.getByText('Conversational AI assistant by OpenAI')).toBeInTheDocument();
    });

    it('renders primary category badge', () => {
        renderWithRouter(<ToolCard tool={mockTool} />);
        expect(screen.getByText('CODE GENERATION')).toBeInTheDocument();
    });

    it('renders pricing model badge', () => {
        renderWithRouter(<ToolCard tool={mockTool} />);
        expect(screen.getByText('FREEMIUM')).toBeInTheDocument();
    });

    it('renders external link button when websiteUrl is present', () => {
        renderWithRouter(<ToolCard tool={mockTool} />);
        const externalLink = screen.getByTestId('icon-external-link');
        expect(externalLink).toBeInTheDocument();
    });

    it('does NOT render external link when websiteUrl is absent', () => {
        const toolWithoutUrl: ToolDto = { ...mockTool, websiteUrl: null };
        renderWithRouter(<ToolCard tool={toolWithoutUrl} />);
        expect(screen.queryByTestId('icon-external-link')).not.toBeInTheDocument();
    });

    it('renders logo fallback initials when logoUrl is null', () => {
        renderWithRouter(<ToolCard tool={mockTool} />);
        // Fallback shows first 2 chars uppercase
        expect(screen.getByText('CH')).toBeInTheDocument();
    });

    it('renders logo img when logoUrl is provided', () => {
        const toolWithLogo: ToolDto = { ...mockTool, logoUrl: 'https://example.com/logo.png' };
        renderWithRouter(<ToolCard tool={toolWithLogo} />);
        const img = screen.getByAltText('ChatGPT logo');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/logo.png');
    });

    it('links to the correct tool detail page', () => {
        renderWithRouter(<ToolCard tool={mockTool} />);
        // The card wraps in a Link (<a>) and there may also be an external <a> button
        const links = screen.getAllByRole('link');
        const toolLink = links.find(l => l.getAttribute('href') === '/tools/chatgpt');
        expect(toolLink).toBeDefined();
    });

    it('displays trending score from intelligenceScore', () => {
        renderWithRouter(<ToolCard tool={mockTool} />);
        expect(screen.getByText('8.5')).toBeInTheDocument();
    });
});
