import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import type { ToolDto } from '../types';
import './Trending.css';

const Trending: React.FC = () => {
    const [tools, setTools] = useState<ToolDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await apiClient.getTrendingTools(0, 50);
                setTools(response.content);
            } catch (error) {
                console.error('Failed to fetch trending tools', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrending();
    }, []);

    return (
        <div className="trending-page">
            <div className="trending-header glass-panel">
                <div className="title-wrapper">
                    <Flame size={32} className="flame-icon" />
                    <h1>Trending AI Tools</h1>
                </div>
                <p>The definitive leaderboard of the fastest-growing AI platforms right now, updated hourly based on GitHub activity, search momentum, and user engagement.</p>
            </div>

            {isLoading ? (
                <div className="loading-grid">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="skeleton-card glass-panel" style={{ height: '220px' }}></div>
                    ))}
                </div>
            ) : (
                <div className="trending-list glass-panel">
                    <div className="list-header">
                        <div className="rank-col">Rank</div>
                        <div className="tool-col">Tool</div>
                        <div className="category-col">Category</div>
                        <div className="score-col">Trending Score <TrendingUp size={16} /></div>
                    </div>

                    <div className="list-body">
                        {tools.map((tool, index) => (
                            <Link to={`/tools/${tool.slug}`} key={tool.id} className="list-row">
                                <div className="rank-col">
                                    <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                                </div>
                                <div className="tool-col">
                                    <div className="t-logo-container">
                                        {tool.logoUrl ? (
                                            <img src={tool.logoUrl} alt={tool.name} />
                                        ) : (
                                            <div className="t-logo-fb">{tool.name.substring(0, 2)}</div>
                                        )}
                                    </div>
                                    <span className="t-name">{tool.name}</span>
                                </div>
                                <div className="category-col">
                                    <span className="badge category-badge">
                                        {(tool.primaryCategory ?? 'OTHER').replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="score-col">
                                    <strong>{(tool.trendingScore ?? 0).toFixed(1)}</strong>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trending;
