import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiClient } from './apiClient';
import type { PagedResponse, ToolDto } from '../types';

/**
 * Unit tests for ApiClient.
 *
 * Uses vi.spyOn to mock the global fetch — no real HTTP requests are made.
 * Tests verify that:
 *   - Correct endpoint URLs are called
 *   - Query parameters are constructed properly
 *   - API errors are propagated as thrown errors
 */

const mockToolDto: ToolDto = {
    id: 'abc-123',
    name: 'Claude',
    slug: 'claude',
    description: 'AI assistant by Anthropic',
    websiteUrl: 'https://claude.ai',
    githubUrl: null,
    logoUrl: null,
    pricingModel: 'FREEMIUM',
    status: 'ACTIVE',
    // Flat category fields (matches Java ToolDto)
    primaryCategory: 'NLP',
    allCategories: ['NLP'],
    // Flat intelligence score fields
    adoptionScore: null,
    trendingScore: null,
    githubStars: null,
    githubForks: null,
    // Live counters
    viewCount: 0,
    clickCount: 0,
    // Timestamps
    createdAt: null,
    updatedAt: null,
    relevanceScore: null,
};

const mockPagedResponse: PagedResponse<ToolDto> = {
    content: [mockToolDto],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
};


function mockFetch(body: unknown, status = 200) {
    return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : 'Internal Server Error',
        json: async () => body,
    } as Response);
}

describe('ApiClient', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    // =========================================================
    // getTrendingTools
    // =========================================================

    it('getTrendingTools: calls /tools/trending with default page/size', async () => {
        const fetchSpy = mockFetch(mockPagedResponse);

        const result = await apiClient.getTrendingTools();

        expect(fetchSpy).toHaveBeenCalledWith(
            'http://localhost:8080/api/v1/tools/trending?page=0&size=10',
            expect.objectContaining({ headers: expect.any(Object) })
        );
        expect(result.content).toHaveLength(1);
        expect(result.content[0].name).toBe('Claude');
    });

    it('getTrendingTools: passes custom page and size', async () => {
        const fetchSpy = mockFetch(mockPagedResponse);

        await apiClient.getTrendingTools(2, 5);

        expect(fetchSpy).toHaveBeenCalledWith(
            'http://localhost:8080/api/v1/tools/trending?page=2&size=5',
            expect.any(Object)
        );
    });

    // =========================================================
    // getToolBySlug
    // =========================================================

    it('getToolBySlug: calls /tools/{slug} endpoint', async () => {
        const fetchSpy = mockFetch(mockToolDto);

        const result = await apiClient.getToolBySlug('claude');

        expect(fetchSpy).toHaveBeenCalledWith(
            'http://localhost:8080/api/v1/tools/claude',
            expect.any(Object)
        );
        expect(result.name).toBe('Claude');
    });

    // =========================================================
    // searchTools
    // =========================================================

    it('searchTools: calls /search with query params', async () => {
        const fetchSpy = mockFetch(mockPagedResponse);

        await apiClient.searchTools('ai assistant', 'NLP');

        const calledUrl = (fetchSpy.mock.calls[0][0] as string);
        expect(calledUrl).toContain('/search');
        expect(calledUrl).toContain('q=ai+assistant');
        expect(calledUrl).toContain('category=NLP');
    });

    it('searchTools: omits category param when not provided', async () => {
        const fetchSpy = mockFetch(mockPagedResponse);

        await apiClient.searchTools('chatgpt');

        const calledUrl = (fetchSpy.mock.calls[0][0] as string);
        expect(calledUrl).not.toContain('category');
    });

    // =========================================================
    // Error handling
    // =========================================================

    it('throws error when API returns non-OK status', async () => {
        mockFetch({ message: 'Server error' }, 500);

        await expect(apiClient.getTrendingTools()).rejects.toThrow('API error');
    });
});
