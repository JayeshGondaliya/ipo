import { Bookmark, ChartNoAxesCombined, CalendarDays, ClipboardCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ watchlistCount = 0 }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="site-header">
            <nav className="nav-wrap" aria-label="Main navigation">
                {/* Brand Logo */}
                <NavLink className="brand" to="/" aria-label="IPOGMP Home">
                    <img src="/logo.png" alt="IPOGMP" className="brand-logo-img" />
                </NavLink>

                {/* Primary Navigation Links */}
                <div className={`main-nav${menuOpen ? ' menu-open' : ''}`} id="primary-navigation">
                    <NavLink
                        onClick={closeMenu}
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        to="/"
                        end
                        title="Live GMP"
                    >
                        <ChartNoAxesCombined aria-hidden="true" size={16} />
                        <span className="nav-label">Live GMP</span>
                    </NavLink>

                    <NavLink
                        onClick={closeMenu}
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        to="/ipos"
                        title="All IPOs Calendar"
                    >
                        <CalendarDays aria-hidden="true" size={16} />
                        <span className="nav-label">All IPOs</span>
                    </NavLink>

                    <NavLink
                        onClick={closeMenu}
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        to="/dashboard"
                        title="Check Allotment & Watchlist"
                    >
                        <ClipboardCheck aria-hidden="true" size={16} />
                        <span className="nav-label">Check Allotment</span>
                    </NavLink>
                </div>

                {/* Actions on the Right */}
                <div className="nav-actions">
                    <div className="nav-market-status" title="Real-time market rates active">
                        <span className="live-dot-pulse" />
                        <span className="market-status-text">Live Rates</span>
                    </div>

                    <NavLink
                        className="nav-watchlist-link"
                        to="/dashboard"
                        aria-label={`Watchlist, ${watchlistCount} saved IPOs`}
                        title="View Saved Watchlist"
                    >
                        <Bookmark aria-hidden="true" size={15} />
                        <span>Watchlist</span>
                        {watchlistCount > 0 && (
                            <span className="nav-watchlist-count">{watchlistCount}</span>
                        )}
                    </NavLink>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="menu-toggle"
                    type="button"
                    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                </button>
            </nav>
        </header>
    );
}