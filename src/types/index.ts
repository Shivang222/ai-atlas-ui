/**
 * Matches Java: com.aidiscovery.shared.dto.ToolDto
 * Fields are flat — no nested intelligenceScore or categories objects.
 */
export interface ToolDto {
    id: string;
    name: string;
    slug: string;
    description: string;
    websiteUrl: string | null;
    githubUrl: string | null;
    logoUrl: string | null;
    pricingModel: string;
    status: string;
    // Category — provided as flat strings by the backend
    primaryCategory: string | null;
    allCategories: string[] | null;
    // Intelligence Score fields — top-level on the DTO
    adoptionScore: number | null;
    trendingScore: number | null;
    githubStars: number | null;
    githubForks: number | null;
    // Redis live counters
    viewCount: number | null;
    clickCount: number | null;
    // Timestamps
    createdAt: string | null;
    updatedAt: string | null;
    // Search relevance (only present when returned from search-service)
    relevanceScore: number | null;
}

/**
 * Matches Java: com.aidiscovery.search.dto.SearchResult
 * Returned by search-service (may differ slightly from ToolDto).
 */
export interface SearchResult {
    toolId: string;
    name: string;
    slug: string;
    description: string;
    websiteUrl: string | null;
    logoUrl: string | null;
    primaryCategory: string | null;
    categories: string[] | null;
    pricingModel: string;
    score: number;
}

export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

/** Analytics stats for a single tool (from analytics-service). */
export interface ToolStats {
    toolId: string;
    views7d: number;
    clicks7d: number;
    searches7d: number;
    trendingScore: number | null;
}

