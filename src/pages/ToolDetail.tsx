import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, Github, Star, GitFork, Activity, HelpCircle, ArrowLeft, Tag } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import type { ToolDto } from '../types';
import './ToolDetail.css';

const ToolDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [tool, setTool] = useState<ToolDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTool = async () => {
            if (!slug) return;
            setIsLoading(true);
            try {
                const data = await apiClient.getToolBySlug(slug);
                setTool(data);
                // Fire VIEW event to analytics service (fire-and-forget)
                apiClient.recordEvent(data.id, 'VIEW');
            } catch (error) {
                console.error('Failed to fetch tool details', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTool();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="tool-detail-loading">
                <div className="loader"></div>
            </div>
        );
    }

    if (!tool) {
        return (
            <div className="tool-not-found glass-panel">
                <h2>Tool Not Found</h2>
                <button onClick={() => navigate('/')} className="back-btn">Return Home</button>
            </div>
        );
    }

    // primaryCategory is a flat string on ToolDto — no nested categories array
    const primaryCategory = tool.primaryCategory;

    return (
        <div className="tool-detail-page">
            <button className="back-nav" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="detail-header glass-panel">
                <div className="detail-logo-container">
                    {tool.logoUrl ? (
                        <img src={tool.logoUrl} alt={tool.name} className="detail-logo" />
                    ) : (
                        <div className="detail-logo-fallback">{tool.name.substring(0, 2).toUpperCase()}</div>
                    )}
                </div>

                <div className="detail-title-section">
                    <h1>{tool.name}</h1>
                    <div className="detail-badges">
                        <span className={`badge pricing ${tool.pricingModel.toLowerCase()}`}>
                            {tool.pricingModel}
                        </span>
                        {primaryCategory && (
                            <span className="badge category">
                                <Tag size={12} />
                                {primaryCategory.replace(/_/g, ' ')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="detail-actions">
                    {tool.websiteUrl && (
                        <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="action-btn website">
                            Visit Website <ExternalLink size={18} />
                        </a>
                    )}
                    <button className="action-btn compare" onClick={() => navigate(`/compare?slugs=${tool.slug}`)}>
                        Compare Tool
                    </button>
                </div>
            </div>

            <div className="detail-content-grid">
                <main className="detail-main glass-panel">
                    <h2>About {tool.name}</h2>
                    <p className="description-text">{tool.description}</p>

                    {/* Further expandable content can go here */}
                </main>

                <aside className="detail-sidebar">
                    <div className="intelligence-score-card glass-panel">
                        <div className="score-header">
                            <h3>Intelligence Score</h3>
                            <HelpCircle size={16} className="help-icon" aria-label="Calculated based on real-time adoption and trending metrics." />
                        </div>
                        <div className="score-big">
                            <span className="score-value">
                                {(tool.adoptionScore ?? 0).toFixed(1)}
                            </span>
                            <span className="score-max">/ 100</span>
                        </div>

                        <div className="score-metrics">
                            <div className="s-metric">
                                <Activity size={16} className="sm-icon trending" />
                                <span>Trending: {(tool.trendingScore ?? 0).toFixed(1)}</span>
                            </div>
                            <div className="s-metric">
                                <Star size={16} className="sm-icon star" />
                                <span>Stars: {(tool.githubStars ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="s-metric">
                                <GitFork size={16} className="sm-icon fork" />
                                <span>Forks: {(tool.githubForks ?? 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {tool.githubUrl && (
                            <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer" className="github-link">
                                <Github size={18} /> View Source
                            </a>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ToolDetail;
