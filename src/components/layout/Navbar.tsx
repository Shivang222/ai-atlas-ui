import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Search, BarChart2, Zap } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <header className="navbar glass-panel">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-logo">
                        <Sparkles className="brand-icon" size={24} />
                    </div>
                    <span className="brand-text">AI Discovery</span>
                </Link>

                <nav className="navbar-nav">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                        Home
                    </NavLink>
                    <NavLink to="/trending" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                        <Zap size={16} />
                        Trending
                    </NavLink>
                    <NavLink to="/compare" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                        Compare
                    </NavLink>
                </nav>

                <div className="navbar-actions">
                    <Link to="/search" className="nav-action-btn search-btn">
                        <Search size={18} />
                        <span>Search</span>
                    </Link>
                    <Link to="/dashboard" className="nav-action-btn icon-btn" title="Dashboard">
                        <BarChart2 size={20} />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
