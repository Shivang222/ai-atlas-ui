import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import type { SearchResult } from '../types';
import './Search.css';

const Search: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const [searchInput, setSearchInput] = useState(query);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        setSearchInput(query);
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.searchTools(query, category, 0, 20);
                setResults(response.content);
                setTotalElements(response.totalElements);
            } catch (error) {
                console.error('Failed to fetch search results', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [query, category]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput });
        } else {
            setSearchParams({});
        }
    };

    const categories = [
        'ALL',
        'CODE_GENERATION',
        'IMAGE_GENERATION',
        'VIDEO_GENERATION',
        'NLP',
        'PRODUCTIVITY',
        'DEVELOPER_TOOLS'
    ];

    return (
        <div className="search-page">
            <div className="search-header">
                <h1 className="search-title">Discover AI Tools</h1>
                <form className="search-bar glass-panel" onSubmit={handleSearch}>
                    <SearchIcon size={20} className="search-icon" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Semantic search (e.g., 'Find me tools to write react code')"
                        className="search-input"
                    />
                    <button type="submit" className="search-submit">Search</button>
                </form>
            </div>

            <div className="search-content">
                <aside className="search-sidebar glass-panel">
                    <div className="filter-header">
                        <Filter size={18} />
                        <h2>Filters</h2>
                    </div>
                    <div className="filter-group">
                        <h3>Categories</h3>
                        <ul className="filter-list">
                            {categories.map(c => (
                                <li key={c}>
                                    <button
                                        className={`filter-btn ${(!category && c === 'ALL') || category === c ? 'active' : ''}`}
                                        onClick={() => {
                                            if (c === 'ALL') {
                                                searchParams.delete('category');
                                                setSearchParams(searchParams);
                                            } else {
                                                setSearchParams({ ...Object.fromEntries(searchParams), category: c });
                                            }
                                        }}
                                    >
                                        {c.replace('_', ' ')}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="search-results">
                    <div className="results-meta">
                        <span>{isLoading ? 'Searching...' : `Found ${totalElements} tools ${query ? `for "${query}"` : ''}`}</span>
                    </div>

                    {isLoading ? (
                        <div className="loading-grid">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="skeleton-card glass-panel"></div>
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <div className="tools-grid">
                            {results.map(result => (
                                <a
                                    key={result.toolId}
                                    href={`/tools/${result.slug}`}
                                    className="tool-card glass-panel"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="card-content" style={{ padding: '1rem' }}>
                                        <h3 className="tool-name" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            {result.name}
                                            {result.pricingModel && (
                                                <span className={`badge pricing-badge ${result.pricingModel.toLowerCase()}`}>
                                                    {result.pricingModel}
                                                </span>
                                            )}
                                        </h3>
                                        <p className="tool-description">{result.description}</p>
                                        {result.primaryCategory && (
                                            <span className="badge category-badge" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                                                {result.primaryCategory.replace(/_/g, ' ')}
                                            </span>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results glass-panel">
                            <SearchIcon size={48} className="no-results-icon" />
                            <h2>No tools found</h2>
                            <p>Try adjusting your search terms or filters.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Search;
