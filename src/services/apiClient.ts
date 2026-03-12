import type { PagedResponse, ToolDto, SearchResult, ToolStats } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class ApiClient {
    private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    // == Tools API ==
    async getTrendingTools(page = 0, size = 10): Promise<PagedResponse<ToolDto>> {
        return this.fetch<PagedResponse<ToolDto>>(`/tools/trending?page=${page}&size=${size}`);
    }

    async getToolBySlug(slug: string): Promise<ToolDto> {
        return this.fetch<ToolDto>(`/tools/${slug}`);
    }

    // Search service — route: /api/v1/search (SearchController)
    async searchTools(query: string, category?: string, page = 0, size = 20): Promise<PagedResponse<SearchResult>> {
        const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
        if (query) params.append('q', query);
        if (category) params.append('category', category);
        return this.fetch<PagedResponse<SearchResult>>(`/search?${params.toString()}`);
    }

    // == Analytics API ==

    /** Record a VIEW or CLICK interaction for a tool. Fire-and-forget. */
    recordEvent(toolId: string, eventType: 'VIEW' | 'CLICK' | 'SEARCH'): void {
        this.fetch<void>(`/analytics/events/${toolId}/${eventType}`, { method: 'POST' }).catch(() => {
            // Analytics failures must never break the UI
        });
    }

    /** Get 7-day stats for a specific tool (views, clicks, searches). */
    async getToolStats(toolId: string): Promise<ToolStats> {
        return this.fetch<ToolStats>(`/analytics/stats/${toolId}`);
    }

    /**
     * Get top N trending tool IDs with scores from Redis sorted set.
     * Returns: { trending: { [toolId]: score } }
     */
    async getTopTrending(n = 10): Promise<{ trending: Record<string, number> }> {
        return this.fetch<{ trending: Record<string, number> }>(`/analytics/trending?n=${n}`);
    }
}

export const apiClient = new ApiClient();

