import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import type { ToolDto } from '../types';
import './Compare.css';

const Compare: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const slugsParam = searchParams.get('slugs') || '';
    const slugs = slugsParam.split(',').filter(Boolean);

    const [tools, setTools] = useState<ToolDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newSlug, setNewSlug] = useState('');

    useEffect(() => {
        const fetchTools = async () => {
            if (slugs.length === 0) return;
            setIsLoading(true);
            try {
                const promises = slugs.map(slug => apiClient.getToolBySlug(slug));
                const results = await Promise.allSettled(promises);

                const fetchedTools = results
                    .filter((res): res is PromiseFulfilledResult<ToolDto> => res.status === 'fulfilled')
                    .map(res => res.value);

                setTools(fetchedTools);
            } catch (error) {
                console.error('Failed to fetch tools for comparison', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTools();
    }, [slugsParam]); // Only refetch when URL params change

    const handleAddTool = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSlug.trim() && !slugs.includes(newSlug.trim())) {
            const updatedSlugs = [...slugs, newSlug.trim()].join(',');
            setSearchParams({ slugs: updatedSlugs });
            setNewSlug('');
        }
    };

    const removeTool = (slugToRemove: string) => {
        const updatedSlugs = slugs.filter(s => s !== slugToRemove).join(',');
        if (updatedSlugs) {
            setSearchParams({ slugs: updatedSlugs });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="compare-page">
            <div className="compare-header">
                <h1>Compare AI Tools</h1>
                <p className="subtitle">Evaluate features, pricing, and intelligence scores side-by-side.</p>

                <form className="add-tool-form glass-panel" onSubmit={handleAddTool}>
                    <input
                        type="text"
                        placeholder="Enter tool slug (e.g. chatgpt, midjourney)..."
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                    />
                    <button type="submit">Add to Compare <ArrowRight size={16} /></button>
                </form>
            </div>

            {slugs.length === 0 ? (
                <div className="empty-compare glass-panel">
                    <h2>No tools selected</h2>
                    <p>Search for tools and click "Compare" to add them here.</p>
                </div>
            ) : isLoading && tools.length === 0 ? (
                <div className="loading-grid">
                    {[1, 2].map(i => <div key={i} className="skeleton-card glass-panel" style={{ height: '400px' }}></div>)}
                </div>
            ) : (
                <div className="compare-matrix glass-panel">
                    <table className="compare-table">
                        <thead>
                            <tr>
                                <th className="feature-col">Feature</th>
                                {tools.map(tool => (
                                    <th key={tool.id} className="tool-col">
                                        <div className="th-header">
                                            {tool.logoUrl ? (
                                                <img src={tool.logoUrl} alt={tool.name} className="c-logo" />
                                            ) : (
                                                <div className="c-logo placeholder">{tool.name.substring(0, 2)}</div>
                                            )}
                                            <h3>{tool.name}</h3>
                                            <button className="remove-btn" onClick={() => removeTool(tool.slug)}>Remove</button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="feature-label">Primary Category</td>
                                {tools.map(tool => (
                                    <td key={tool.id}>
                                        <span className="badge category-badge">
                                            {(tool.primaryCategory ?? 'OTHER').replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="feature-label">Pricing Model</td>
                                {tools.map(tool => (
                                    <td key={tool.id}>
                                        <span className={`badge pricing-badge ${tool.pricingModel.toLowerCase()}`}>
                                            {tool.pricingModel}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="feature-label">Intelligence Score</td>
                                {tools.map(tool => (
                                    <td key={tool.id}>
                                        <strong className="score-highlight">
                                            {(tool.adoptionScore ?? 0).toFixed(1)}
                                        </strong>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="feature-label">GitHub Source</td>
                                {tools.map(tool => (
                                    <td key={tool.id}>
                                        {tool.githubUrl ? <Check className="icon-yes" /> : <Minus className="icon-no" />}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="feature-label">Description</td>
                                {tools.map(tool => (
                                    <td key={tool.id} className="desc-cell">
                                        <p>{tool.description}</p>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Compare;
