import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Activity, ArrowUpRight } from 'lucide-react';
import type { ToolDto } from '../../types';
import './ToolCard.css';

interface ToolCardProps {
    tool: ToolDto;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
    // primaryCategory is a flat string on ToolDto — no nested categories array
    const primaryCategory = tool.primaryCategory ?? 'OTHER';
    const trendingScore = tool.trendingScore ?? 0;

    return (
        <Link to={`/tools/${tool.slug}`} className="tool-card glass-panel">
            <div className="card-header">
                <div className="logo-container">
                    {tool.logoUrl ? (
                        <img src={tool.logoUrl} alt={`${tool.name} logo`} className="tool-logo" />
                    ) : (
                        <div className="logo-fallback">{tool.name.substring(0, 2).toUpperCase()}</div>
                    )}
                </div>
                <div className="card-badges">
                    <span className="badge category-badge">{primaryCategory.replace(/_/g, ' ')}</span>
                    <span className={`badge pricing-badge ${tool.pricingModel.toLowerCase()}`}>
                        {tool.pricingModel}
                    </span>
                </div>
            </div>

            <div className="card-content">
                <h3 className="tool-name">
                    {tool.name}
                    <ArrowUpRight size={18} className="hover-arrow" />
                </h3>
                <p className="tool-description">{tool.description}</p>
            </div>

            <div className="card-footer">
                <div className="metrics">
                    <div className="metric" title="Trending Score">
                        <Activity size={16} className="metric-icon trending" />
                        <span>{trendingScore.toFixed(1)}</span>
                    </div>
                    <div className="metric" title="GitHub Stars">
                        <Star size={16} className="metric-icon star" />
                        <span>{(tool.githubStars ?? 0).toLocaleString()}</span>
                    </div>
                </div>

                {tool.websiteUrl && (
                    <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="external-link-btn"
                    >
                        <ExternalLink size={16} />
                    </a>
                )}
            </div>
        </Link>
    );
};
