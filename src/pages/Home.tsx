import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import type { ToolDto } from '../types';
import { ToolCard } from '../components/domain/ToolCard';
import './Home.css';

const Home: React.FC = () => {
    const [trendingTools, setTrendingTools] = useState<ToolDto[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await apiClient.getTrendingTools(0, 8);
                setTrendingTools(response.content);
            } catch (error) {
                console.error('Failed to fetch trending tools', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-glow"></div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        Discover the Future of <br />
                        <span className="text-gradient">AI Intelligence</span>
                    </h1>
                    <p className="hero-subtitle">
                        A real-time directory of the world's most powerful AI tools, categorized entirely by AI.
                    </p>

                    <form className="hero-search glass-panel" onSubmit={handleSearch}>
                        <Search className="search-icon" size={24} />
                        <input
                            type="text"
                            placeholder="Search by use-case, category, or tool name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-submit">Explore</button>
                    </form>

                    <div className="popular-tags">
                        <span>Popular:</span>
                        <button onClick={() => navigate('/search?category=CODE_GENERATION')} className="tag">Code Generation</button>
                        <button onClick={() => navigate('/search?category=IMAGE_GENERATION')} className="tag">Image Gen</button>
                        <button onClick={() => navigate('/search?category=PRODUCTIVITY')} className="tag">Productivity</button>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="trending-section">
                <div className="section-header">
                    <h2 className="section-title">Trending AI Tools</h2>
                    <button className="view-all-btn" onClick={() => navigate('/trending')}>View All</button>
                </div>

                {isLoading ? (
                    <div className="loading-grid">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="skeleton-card glass-panel"></div>
                        ))}
                    </div>
                ) : (
                    <div className="tools-grid">
                        {trendingTools.map(tool => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
