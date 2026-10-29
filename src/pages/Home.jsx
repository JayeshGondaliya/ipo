import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Popover } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { 
    Calendar, 
    MessageCircle, 
    Send, 
    Globe, 
    SlidersHorizontal, 
    LayoutGrid, 
    List 
} from 'lucide-react';
import IPOGmpTable from '../components/ipo/IPOGmpTable.jsx';
import IPOGmpGrid from '../components/ipo/IPOGmpGrid.jsx';
import IPOSeoContent from '../components/common/IPOSeoContent.jsx';
import ipos, { allIpos } from '../data/ipos.js';
import { getIpos } from '../api/ipoApi.js';

function formatSidebarDates(openVal, closeVal) {
    if (!openVal && !closeVal) return '';
    try {
        const d1 = openVal ? new Date(`${openVal}T12:00:00`) : null;
        const d2 = closeVal ? new Date(`${closeVal}T12:00:00`) : null;
        if (d1 && d2) {
            const day1 = d1.getDate();
            const day2 = d2.getDate();
            const m1 = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d1);
            const m2 = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d2);
            if (m1 === m2) {
                return `(${day1}-${day2} ${m1})`;
            }
            return `(${day1} ${m1} - ${day2} ${m2})`;
        }
        if (d1) return `(From ${d1.getDate()} ${new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d1)})`;
        if (d2) return `(Closes ${d2.getDate()} ${new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d2)})`;
    } catch {
        return '';
    }
    return '';
}

export default function Home({ watchlist = [], onToggleWatchlist }) {
    const [liveIpos, setLiveIpos] = useState(allIpos);
    const [boardFilter, setBoardFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    useEffect(() => {
        let active = true;
        getIpos().then((res) => {
            if (active && res.success && res.data?.length > 0) {
                setLiveIpos(res.data);
            }
        });
        return () => {
            active = false;
        };
    }, []);

    // Focused Current Market Pool: Active offerings first, then recently listed offerings sorted by date
    const currentMarketIpos = useMemo(() => {
        const active = liveIpos.filter((i) => i.status !== 'listed');
        const sortedListed = liveIpos
            .filter((i) => i.status === 'listed')
            .sort((a, b) => {
                const dateA = a.listingDate || a.closeDate || '';
                const dateB = b.listingDate || b.closeDate || '';
                return dateB.localeCompare(dateA);
            });
        return [...active, ...sortedListed];
    }, [liveIpos]);

    // Filtered IPOs
    const filteredIPOs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return currentMarketIpos.filter((ipo) => {
            // Status match
            if (statusFilter === 'active') {
                if (ipo.status === 'listed') return false;
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
            // Priority: 0: open, 1: upcoming, 2: closed, 3: listed
            const statusPriority = { open: 0, upcoming: 1, closed: 2, listed: 3 };
            const priorityDiff = (statusPriority[a.status] ?? 4) - (statusPriority[b.status] ?? 4);
            if (priorityDiff !== 0) return priorityDiff;

            // Tie-breaking within same status
            if (a.status === 'open') {
                // Open offerings: highest GMP first, then closing sooner
                const gmpDiff = (b.gmp || 0) - (a.gmp || 0);
                if (gmpDiff !== 0) return gmpDiff;
                if (a.closeDate && b.closeDate) return a.closeDate.localeCompare(b.closeDate);
                return (b.gmpPercent || 0) - (a.gmpPercent || 0);
            }

            if (a.status === 'upcoming') {
                // Upcoming offerings: opening sooner first, then higher GMP
                if (a.openDate && b.openDate && a.openDate !== b.openDate) {
                    return a.openDate.localeCompare(b.openDate);
                }
                return (b.gmp || 0) - (a.gmp || 0);
            }

            if (a.status === 'closed') {
                // Closed: most recently closed first
                if (a.closeDate && b.closeDate && a.closeDate !== b.closeDate) {
                    return b.closeDate.localeCompare(a.closeDate);
                }
                return (b.gmp || 0) - (a.gmp || 0);
            }

            if (a.status === 'listed') {
                // Listed: most recently listed first
                const dateA = a.listingDate || a.closeDate || '';
                const dateB = b.listingDate || b.closeDate || '';
                if (dateA && dateB && dateA !== dateB) {
                    return dateB.localeCompare(dateA);
                }
                return (b.gmp || 0) - (a.gmp || 0);
            }

            return (b.gmp || 0) - (a.gmp || 0);
        });
    }, [currentMarketIpos, statusFilter, boardFilter, searchQuery]);

    // Fast counts
    const openCount = currentMarketIpos.filter((i) => i.status === 'open').length;
    const upcomingCount = currentMarketIpos.filter((i) => i.status === 'upcoming').length;
    const closedCount = currentMarketIpos.filter((i) => i.status === 'closed').length;
    const listedCount = currentMarketIpos.filter((i) => i.status === 'listed').length;
    const activeOfferingsCount = openCount + upcomingCount;

    // Sidebar lists: active first, then recent listed
    const mainboardSidebarIpos = useMemo(() => {
        const active = liveIpos.filter((i) => i.board === 'Mainboard' && i.status !== 'listed');
        if (active.length >= 8) return active.slice(0, 8);
        const recentListed = liveIpos
            .filter((i) => i.board === 'Mainboard' && i.status === 'listed')
            .sort((a, b) => {
                const dateA = a.listingDate || a.closeDate || '';
                const dateB = b.listingDate || b.closeDate || '';
                return dateB.localeCompare(dateA);
            });
        return [...active, ...recentListed].slice(0, 8);
    }, [liveIpos]);

    const smeSidebarIpos = useMemo(() => {
        const active = liveIpos.filter((i) => i.board === 'SME' && i.status !== 'listed');
        if (active.length >= 8) return active.slice(0, 8);
        const recentListed = liveIpos
            .filter((i) => i.board === 'SME' && i.status === 'listed')
            .sort((a, b) => {
                const dateA = a.listingDate || a.closeDate || '';
                const dateB = b.listingDate || b.closeDate || '';
                return dateB.localeCompare(dateA);
            });
        return [...active, ...recentListed].slice(0, 8);
    }, [liveIpos]);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());

    return (
        <div className="py-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content Column */}
                <div className="lg:col-span-8 xl:col-span-9 min-w-0">
                    {/* Natural Editorial Header */}
                    <div className="mb-5">
                        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-snug mb-2.5">
                            IPO GMP Today: Live IPO Grey Market Premium
                        </h1>

                        {/* Author & Byline Meta Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-[13px] text-slate-500 mb-3 font-normal">
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar size={14} className="text-slate-400" /> {formattedDate}
                            </span>
                        </div>

                        {/* Social Follow Actions */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <a
                                href="https://chat.whatsapp.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-semibold text-xs transition-colors"
                            >
                                <MessageCircle size={14} className="text-[#25D366]" /> Join
                            </a>
                            <a
                                href="https://news.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors"
                            >
                                <Globe size={14} className="text-red-500" /> Add Source
                            </a>
                            <a
                                href="https://t.me"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 font-semibold text-xs transition-colors"
                            >
                                <Send size={14} className="text-[#0088cc]" /> Follow
                            </a>
                        </div>

                        {/* Editorial Context Description */}
                        <p className="text-[14px] sm:text-[15px] leading-relaxed text-slate-700 font-normal max-w-4xl">
                            IPO GMP, also known as the grey market premium, is trending for upcoming and current Mainboard and SME IPOs. The GMP gives live estimates of the upcoming IPOs listing and its an unofficial indicator for listing expectations.
                        </p>
                    </div>

                    {/* Streamlined Controls Bar (Clean UX - InvestorGain Reference) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                        {/* Board Pill Switcher: All | Mainboard | SME */}
                        <div className="inline-flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setBoardFilter('all')}
                                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                                    boardFilter === 'all'
                                        ? 'bg-[#056a42] text-white shadow-sm border border-[#056a42]'
                                        : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400'
                                }`}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={() => setBoardFilter('Mainboard')}
                                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                                    boardFilter === 'Mainboard'
                                        ? 'bg-[#056a42] text-white shadow-sm border border-[#056a42]'
                                        : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400'
                                }`}
                            >
                                Mainboard
                            </button>
                            <button
                                type="button"
                                onClick={() => setBoardFilter('SME')}
                                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                                    boardFilter === 'SME'
                                        ? 'bg-[#056a42] text-white shadow-sm border border-[#056a42]'
                                        : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400'
                                }`}
                            >
                                SME
                            </button>
                        </div>

                        {/* Right: View Toggle, Filters Popover & Search */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Grid / Table View Switcher */}
                            <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200 text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                                        viewMode === 'grid'
                                            ? 'bg-white text-slate-900 shadow-sm font-bold'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="Grid Card View"
                                >
                                    <LayoutGrid size={13} />
                                    <span>GRID</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                                        viewMode === 'table'
                                            ? 'bg-white text-[#056a42] shadow-sm font-bold'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="Master Table View"
                                >
                                    <List size={13} />
                                    <span>TABLE</span>
                                </button>
                            </div>

                            {/* Filters Button with Clean Popover */}
                            <Popover
                                content={
                                    <div className="w-56 p-1 space-y-3">
                                        <div>
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                                Offering Status
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                {[
                                                    { key: 'all', label: `All (Active & Listed)` },
                                                    { key: 'active', label: `Active (${activeOfferingsCount})` },
                                                    { key: 'open', label: `Live Open (${openCount})` },
                                                    { key: 'upcoming', label: `Upcoming (${upcomingCount})` },
                                                    { key: 'closed', label: `Closed (${closedCount})` },
                                                    { key: 'listed', label: `Listed (${listedCount})` },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.key}
                                                        type="button"
                                                        onClick={() => setStatusFilter(opt.key)}
                                                        className={`text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                                            statusFilter === opt.key
                                                                ? 'bg-emerald-50 text-[#056a42] font-semibold'
                                                                : 'text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <span>{opt.label}</span>
                                                        {statusFilter === opt.key && <span className="text-[#056a42] font-bold">✓</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {statusFilter !== 'all' && (
                                            <div className="pt-2 border-t border-slate-100 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setStatusFilter('all')}
                                                    className="text-xs text-[#056a42] hover:underline font-semibold cursor-pointer"
                                                >
                                                    Reset to All
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                }
                                trigger="click"
                                placement="bottomRight"
                            >
                                <Button
                                    size="middle"
                                    className={`!inline-flex !items-center !gap-1.5 !text-xs !font-semibold !rounded-md ${
                                        statusFilter !== 'all'
                                            ? '!border-[#056a42] !text-[#056a42] !bg-emerald-50/50'
                                            : '!border-slate-300 !text-slate-700 hover:!border-slate-400'
                                    }`}
                                >
                                    <SlidersHorizontal size={13} />
                                    <span>Filters</span>
                                    {statusFilter !== 'all' && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#056a42]" />
                                    )}
                                </Button>
                            </Popover>

                            {/* Search IPOs Input */}
                            <Input
                                placeholder="Search IPOs..."
                                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                allowClear
                                className="w-36 sm:w-48 !rounded-md text-xs"
                            />
                        </div>
                    </div>

                    {/* Offerings Content: Table or Grid */}
                    {viewMode === 'table' ? (
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="sm:hidden flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-medium select-none">
                                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Live GMP Table
                                </span>
                                <span className="text-[#056a42] font-semibold flex items-center gap-1">
                                    Swipe table &rarr;
                                </span>
                            </div>
                            <IPOGmpTable
                                ipos={filteredIPOs}
                                watchlist={watchlist}
                                onToggleWatchlist={onToggleWatchlist}
                            />
                        </div>
                    ) : (
                        <IPOGmpGrid
                            ipos={filteredIPOs}
                            watchlist={watchlist}
                            onToggleWatchlist={onToggleWatchlist}
                        />
                    )}

                    {/* Educational & SEO Knowledge Base */}
                    <IPOSeoContent />
                </div>

                {/* Right Sidebar Widget (Authentic Financial Publication Style) */}
                <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
                    {/* CURRENT MAINBOARD IPO Widget */}
                    <div className="border border-[#136aa6]/40 bg-white shadow-sm overflow-hidden rounded-lg">
                        <div className="bg-[#136aa6] text-white px-3.5 py-2.5 text-xs font-bold tracking-wider uppercase">
                            CURRENT MAINBOARD IPO
                        </div>
                        <ul className="divide-y divide-slate-100 p-2.5 space-y-1">
                            {mainboardSidebarIpos.map((ipo) => (
                                <li key={ipo.id} className="py-1">
                                    <Link
                                        to={`/ipos/${ipo.id}`}
                                        className="text-[13px] leading-snug font-normal text-[#0b5c92] hover:text-[#06385a] hover:underline block"
                                    >
                                        {ipo.company} {formatSidebarDates(ipo.openDate, ipo.closeDate)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CURRENT SME IPO Widget */}
                    <div className="border border-[#056a42]/40 bg-white shadow-sm overflow-hidden rounded-lg">
                        <div className="bg-[#056a42] text-white px-3.5 py-2.5 text-xs font-bold tracking-wider uppercase">
                            CURRENT SME IPO
                        </div>
                        <ul className="divide-y divide-slate-100 p-2.5 space-y-1">
                            {smeSidebarIpos.map((ipo) => (
                                <li key={ipo.id} className="py-1">
                                    <Link
                                        to={`/ipos/${ipo.id}`}
                                        className="text-[13px] leading-snug font-normal text-[#0b5c92] hover:text-[#06385a] hover:underline block"
                                    >
                                        {ipo.company} {formatSidebarDates(ipo.openDate, ipo.closeDate)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links Widget */}
                    <div className="border border-slate-200 bg-white shadow-sm overflow-hidden rounded-lg p-3.5">
                        <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase mb-2.5 flex items-center gap-1.5">
                            <span>⚡</span> Quick Links
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                            <li>
                                <button 
                                    type="button" 
                                    onClick={() => setBoardFilter('Mainboard')} 
                                    className="hover:text-[#056a42] hover:underline text-left block w-full py-0.5 cursor-pointer"
                                >
                                    &bull; Current Mainboard IPOs
                                </button>
                            </li>
                            <li>
                                <button 
                                    type="button" 
                                    onClick={() => setBoardFilter('SME')} 
                                    className="hover:text-[#056a42] hover:underline text-left block w-full py-0.5 cursor-pointer"
                                >
                                    &bull; Current SME IPOs
                                </button>
                            </li>
                            <li>
                                <Link to="/ipos" className="hover:text-[#056a42] hover:underline block py-0.5">
                                    &bull; All IPO Calendar 2026
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="hover:text-[#056a42] hover:underline block py-0.5">
                                    &bull; Check Allotment Status Links
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-[#056a42] hover:underline block py-0.5">
                                    &bull; About IPOGMP & Methodology
                                </Link>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
