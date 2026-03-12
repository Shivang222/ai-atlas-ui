import React, { useEffect, useState } from 'react';
import { Users, MousePointerClick, Database, TrendingUp } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [totalTools, setTotalTools] = useState<number | null>(null);
    const [trendingCount, setTrendingCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // Fetch total indexed tools (via totalElements from paged response)
                const toolsPage = await apiClient.getTrendingTools(0, 1);
                setTotalTools(toolsPage.totalElements);

                // Fetch top trending tools from Redis sorted set
                const trending = await apiClient.getTopTrending(50);
                setTrendingCount(Object.keys(trending.trending).length);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardStats();
    }, []);

    const fmt = (n: number | null) => (n === null ? '...' : n.toLocaleString());

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Analytics Dashboard</h1>
                <p>System-wide health and engagement metrics.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper blue"><Database size={24} /></div>
                    <div className="stat-info">
                        <h3>Total Tools Indexed</h3>
                        <p className="stat-value">{isLoading ? '...' : fmt(totalTools)}</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper green"><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <h3>Trending Tools (Redis)</h3>
                        <p className="stat-value">{isLoading ? '...' : fmt(trendingCount)}</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper purple"><MousePointerClick size={24} /></div>
                    <div className="stat-info">
                        <h3>Tool Views (24h)</h3>
                        <p className="stat-value" title="From Grafana — updated by nightly batch">via Grafana</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper orange"><Users size={24} /></div>
                    <div className="stat-info">
                        <h3>Active Users</h3>
                        <p className="stat-value" title="From Grafana — tracked by analytics-service">via Grafana</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-charts glass-panel">
                <div className="chart-placeholder">
                    <p>Time-Series Engagement Charts are powered by Analytics Service + Grafana</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '0.5rem' }}>
                        Open Grafana at <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer">localhost:3001</a> to view real-time dashboards.
                    </p>
                    <div className="mock-graph"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

