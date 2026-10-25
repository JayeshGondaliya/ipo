import { useMemo, useState } from 'react';
import { 
    Tabs, 
    Segmented, 
    Input, 
    Tag, 
    Typography 
} from 'antd';
import { 
    SearchOutlined, 
    ThunderboltFilled,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
    RiseOutlined
} from '@ant-design/icons';
import IPOGmpTable from '../components/ipo/IPOGmpTable.jsx';
import ipos, { allIpos, indexGeneratedAt } from '../data/ipos.js';

const { Title, Text } = Typography;

export default function Home({ watchlist = [], onToggleWatchlist }) {
    // Default tab: 'active' (Open, Upcoming, and Closed current offerings)
    const [statusFilter, setStatusFilter] = useState('active');
    const [boardFilter, setBoardFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Focused Current Market Pool (Current active October 2026 issues + Recent September/October listings)
    const currentMarketIpos = useMemo(() => {
        const currentMonthSlugs = new Set(ipos.map((i) => i.id));
        const activeCurrent = ipos;

        // Recent listed issues from late September / October 2026
        const recentListed = allIpos
            .filter((i) => !currentMonthSlugs.has(i.id) && i.status === 'listed' && i.listingDate && i.listingDate >= '2026-09-15')
            .slice(0, 15);

        return [...activeCurrent, ...recentListed];
    }, []);

    // Filtered IPOs
    const filteredIPOs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return currentMarketIpos.filter((ipo) => {
            // Status match
            if (statusFilter === 'active') {
                if (ipo.status === 'listed') return false; // Focus on active (open, upcoming, closed/allotment)
            } else if (statusFilter !== 'all') {
                if (ipo.status !== statusFilter) return false;
            }

            // Board match
            if (boardFilter !== 'all' && ipo.board !== boardFilter) return false;

            // Search query
            if (query) {
                const matchString = `${ipo.company} ${ipo.symbol} ${ipo.sector} ${ipo.exchange}`.toLowerCase();
                if (!matchString.includes(query)) return false;
            }
            return true;
        }).sort((a, b) => {
            // Put open first, then upcoming, then closed, then listed, or by GMP %
            const statusPriority = { open: 0, upcoming: 1, closed: 2, listed: 3 };
            const priorityDiff = (statusPriority[a.status] ?? 4) - (statusPriority[b.status] ?? 4);
            if (priorityDiff !== 0) return priorityDiff;
            return (b.gmpPercent || 0) - (a.gmpPercent || 0);
        });
    }, [currentMarketIpos, statusFilter, boardFilter, searchQuery]);

    // Fast counts
    const activeOfferingsCount = currentMarketIpos.filter((i) => i.status !== 'listed').length;
    const openCount = currentMarketIpos.filter((i) => i.status === 'open').length;
    const upcomingCount = currentMarketIpos.filter((i) => i.status === 'upcoming').length;
    const closedCount = currentMarketIpos.filter((i) => i.status === 'closed').length;
    const listedCount = currentMarketIpos.filter((i) => i.status === 'listed').length;

    return (
        <div className="home-compact-layout">
            {/* Top Compact Live Market Header */}
            <header className="market-compact-header">
                <div className="header-meta-group">
                    <div className="title-and-pulse">
                        <h1 className="compact-page-title">Live IPO GMP (Grey Market Premium)</h1>
                        <span className="live-status-badge">
                            <span className="pulse-green-dot" /> LIVE MARKET RATES
                        </span>
                    </div>
                    <p className="compact-page-subtitle">
                        Real-time grey market rates, estimated listing gains, lot profit calculations, and live subscription status.
                    </p>
                </div>

                {/* Compact Quick-Stats Pills */}
                <div className="compact-quick-stats">
                    <div 
                        className={`stat-pill ${statusFilter === 'open' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('open')}
                        role="button"
                        tabIndex={0}
                    >
                        <span className="stat-indicator green" />
                        <span className="stat-num">{openCount}</span>
                        <span className="stat-label">Open Now</span>
                    </div>

                    <div 
                        className={`stat-pill ${statusFilter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('upcoming')}
                        role="button"
                        tabIndex={0}
                    >
                        <span className="stat-indicator blue" />
                        <span className="stat-num">{upcomingCount}</span>
                        <span className="stat-label">Upcoming</span>
                    </div>

                    <div 
                        className={`stat-pill ${statusFilter === 'closed' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('closed')}
                        role="button"
                        tabIndex={0}
                    >
                        <span className="stat-indicator amber" />
                        <span className="stat-num">{closedCount}</span>
                        <span className="stat-label">Closed / Allotment</span>
                    </div>

                    <div 
                        className={`stat-pill ${statusFilter === 'listed' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('listed')}
                        role="button"
                        tabIndex={0}
                    >
                        <span className="stat-indicator purple" />
                        <span className="stat-num">{listedCount}</span>
                        <span className="stat-label">Recent Listed</span>
                    </div>
                </div>
            </header>

            {/* Direct Table Card with Filters Right on Top */}
            <main className="table-wrapper-card">
                <div className="table-controls-strip">
                    {/* Status Tabs */}
                    <div className="tabs-container">
                        <Tabs
                            activeKey={statusFilter}
                            onChange={(key) => setStatusFilter(key)}
                            items={[
                                { key: 'active', label: `Active IPOs (${activeOfferingsCount})` },
                                { key: 'open', label: `Live Open (${openCount})` },
                                { key: 'upcoming', label: `Upcoming (${upcomingCount})` },
                                { key: 'closed', label: `Closed (${closedCount})` },
                                { key: 'listed', label: `Recently Listed (${listedCount})` },
                                { key: 'all', label: `All (${currentMarketIpos.length})` },
                            ]}
                            className="compact-status-tabs"
                        />
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="secondary-controls">
                        <Segmented
                            value={boardFilter}
                            onChange={(val) => setBoardFilter(val)}
                            options={[
                                { label: 'All Boards', value: 'all' },
                                { label: 'Mainboard', value: 'Mainboard' },
                                { label: 'SME', value: 'SME' },
                            ]}
                            className="board-segmented"
                        />

                        <Input
                            placeholder="Search company or symbol..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            allowClear
                            className="compact-search-input"
                        />
                    </div>
                </div>

                {/* Master Table Displayed Immediately */}
                <IPOGmpTable
                    ipos={filteredIPOs}
                    watchlist={watchlist}
                    onToggleWatchlist={onToggleWatchlist}
                />
            </main>
        </div>
    );
}