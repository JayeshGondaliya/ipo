import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Segmented, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Calendar, MessageCircle, Send, Globe } from 'lucide-react';
import IPOGmpTable from '../components/ipo/IPOGmpTable.jsx';
import IPOSeoContent from '../components/common/IPOSeoContent.jsx';
import ipos, { allIpos } from '../data/ipos.js';

function formatSidebarDates(openVal, closeVal) {
    if (!openVal && !closeVal) return '';
    try {
        const d1 = openVal ? new Date(`${openVal}T12:00:00`) : null;
        const d2 = closeVal ? new Date(`${closeVal}T12:00:00`) : null;
        if (d1 && d2) {
            const day1 = d1.getDate();
            const day2 = d2.getDate();
            const m1 = new Intl.DateTimeFormat('en-IN', { month: 'long' }).format(d1);
            const m2 = new Intl.DateTimeFormat('en-IN', { month: 'long' }).format(d2);
            if (m1 === m2) {
                return `(${day1}-${day2} ${m1})`;
            }
            return `(${day1}-${day2} ${m2})`;
        }
        if (d1) return `(From ${d1.getDate()} ${new Intl.DateTimeFormat('en-IN', { month: 'long' }).format(d1)})`;
        if (d2) return `(Closes ${d2.getDate()} ${new Intl.DateTimeFormat('en-IN', { month: 'long' }).format(d2)})`;
    } catch {
        return '';
    }
    return '';
}

export default function Home({ watchlist = [], onToggleWatchlist }) {
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

    // Helper: returns true if a closed IPO's subscription window has NOT yet expired past today
    const todayStr = new Date().toISOString().slice(0, 10);
    const isNotExpiredClosed = (ipo) => {
        if (ipo.status !== 'closed') return true; // non-closed always passes
        // If closeDate is known and is before today, it's truly expired — exclude from Active
        if (ipo.closeDate && ipo.closeDate < todayStr) return false;
        return true;
    };

    // Filtered IPOs
    const filteredIPOs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const todayLocal = new Date().toISOString().slice(0, 10);
        return currentMarketIpos.filter((ipo) => {
            // Status match
            if (statusFilter === 'active') {
                if (ipo.status === 'listed') return false;
                // Exclude closed IPOs whose close date has already passed today
                if (ipo.status === 'closed' && ipo.closeDate && ipo.closeDate < todayLocal) return false;
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
            const statusPriority = { open: 0, upcoming: 1, closed: 2, listed: 3 };
            const priorityDiff = (statusPriority[a.status] ?? 4) - (statusPriority[b.status] ?? 4);
            if (priorityDiff !== 0) return priorityDiff;
            return (b.gmpPercent || 0) - (a.gmpPercent || 0);
        });
    }, [currentMarketIpos, statusFilter, boardFilter, searchQuery]);

    // Fast counts — Active count also excludes expired closed IPOs
    const activeOfferingsCount = currentMarketIpos.filter((i) => i.status !== 'listed' && isNotExpiredClosed(i)).length;
    const openCount = currentMarketIpos.filter((i) => i.status === 'open').length;
    const upcomingCount = currentMarketIpos.filter((i) => i.status === 'upcoming').length;
    const closedCount = currentMarketIpos.filter((i) => i.status === 'closed').length;
    const listedCount = currentMarketIpos.filter((i) => i.status === 'listed').length;

    // Sidebar lists
    const mainboardSidebarIpos = useMemo(() => {
        const mb = currentMarketIpos.filter((i) => i.board === 'Mainboard' && i.status !== 'listed');
        if (mb.length >= 6) return mb.slice(0, 8);
        const fallback = allIpos.filter((i) => i.board === 'Mainboard' && (i.status === 'upcoming' || i.status === 'open' || i.status === 'closed'));
        return [...mb, ...fallback.filter((f) => !mb.some((m) => m.id === f.id))].slice(0, 8);
    }, [currentMarketIpos]);

    const smeSidebarIpos = useMemo(() => {
        const sme = currentMarketIpos.filter((i) => i.board === 'SME' && i.status !== 'listed');
        if (sme.length >= 6) return sme.slice(0, 8);
        const fallback = allIpos.filter((i) => i.board === 'SME' && (i.status === 'upcoming' || i.status === 'open' || i.status === 'closed'));
        return [...sme, ...fallback.filter((f) => !sme.some((m) => m.id === f.id))].slice(0, 8);
    }, [currentMarketIpos]);

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
                    {/* Natural Editorial Header (Direct Render - No Boxed Card) */}
                    <div className="mb-6">
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

                    {/* Section Subheader & Controls */}
                    <div className="mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900 m-0 tracking-tight">
                                {boardFilter === 'Mainboard'
                                    ? 'Current Mainboard IPO'
                                    : boardFilter === 'SME'
                                        ? 'Current SME IPO'
                                        : 'Current Mainboard & SME IPO'}
                            </h2>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                                <Segmented
                                    value={boardFilter}
                                    onChange={(val) => setBoardFilter(val)}
                                    options={[
                                        { label: 'All Boards', value: 'all' },
                                        { label: 'Mainboard', value: 'Mainboard' },
                                        { label: 'SME', value: 'SME' },
                                    ]}
                                    className="board-segmented w-full sm:w-auto"
                                />
                                <Input
                                    placeholder="Search company..."
                                    prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    allowClear
                                    className="w-full sm:w-52"
                                />
                            </div>
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="mt-2.5">
                            <Tabs
                                activeKey={statusFilter}
                                onChange={(key) => setStatusFilter(key)}
                                items={[
                                    { key: 'active', label: `Active (${activeOfferingsCount})` },
                                    { key: 'open', label: `Open (${openCount})` },
                                    { key: 'upcoming', label: `Upcoming (${upcomingCount})` },
                                    { key: 'closed', label: `Closed (${closedCount})` },
                                    { key: 'listed', label: `Listed (${listedCount})` },
                                    { key: 'all', label: `All (${currentMarketIpos.length})` },
                                ]}
                                className="compact-status-tabs"
                            />
                        </div>
                    </div>

                    {/* Direct Master Table */}
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
                </aside>
            </div>
        </div>
    );
}