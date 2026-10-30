import { useEffect, useMemo, useState } from 'react';
import { Input, Button, Empty } from 'antd';
import { 
    SearchOutlined, 
    CalendarOutlined, 
    ReloadOutlined, 
    ClearOutlined 
} from '@ant-design/icons';
import { LayoutGrid, List, Sparkles } from 'lucide-react';
import IPOGmpTable from '../components/ipo/IPOGmpTable.jsx';
import IPOGmpGrid from '../components/ipo/IPOGmpGrid.jsx';
import IPOSeoContent from '../components/common/IPOSeoContent.jsx';
import { getIpos } from '../api/ipoApi.js';

export default function IPOList({ watchlist = [], onToggleWatchlist }) {
    const [liveIpos, setLiveIpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [boardFilter, setBoardFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const loadData = () => {
        setLoading(true);
        getIpos().then((res) => {
            if (res.success && res.data?.length > 0) {
                setLiveIpos(res.data);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    // Status counts across all IPOs
    const counts = useMemo(() => {
        return {
            all: liveIpos.length,
            open: liveIpos.filter((i) => i.status === 'open').length,
            upcoming: liveIpos.filter((i) => i.status === 'upcoming').length,
            closed: liveIpos.filter((i) => i.status === 'closed').length,
            listed: liveIpos.filter((i) => i.status === 'listed').length,
        };
    }, [liveIpos]);

    // Filter & Sort all IPOs
    const filteredIPOs = useMemo(() => {
        const query = search.trim().toLowerCase();

        return liveIpos
            .filter((ipo) => {
                // Status filter
                if (statusFilter !== 'all' && ipo.status !== statusFilter) return false;

                // Board filter
                if (boardFilter !== 'all' && ipo.board !== boardFilter) return false;

                // Search query
                if (query) {
                    const matchString = `${ipo.company} ${ipo.name} ${ipo.symbol || ''} ${ipo.sector || ''} ${ipo.subType || ''}`.toLowerCase();
                    if (!matchString.includes(query)) return false;
                }

                return true;
            })
            .sort((a, b) => {
                // Priority by status: open -> upcoming -> closed -> listed
                const statusPriority = { open: 0, upcoming: 1, closed: 2, listed: 3 };
                const pDiff = (statusPriority[a.status] ?? 4) - (statusPriority[b.status] ?? 4);
                if (pDiff !== 0) return pDiff;

                // If both open: higher GMP first
                if (a.status === 'open') {
                    return (b.gmp || 0) - (a.gmp || 0);
                }
                // If both upcoming: opening sooner first
                if (a.status === 'upcoming') {
                    if (a.openDate && b.openDate) return a.openDate.localeCompare(b.openDate);
                    return (b.gmp || 0) - (a.gmp || 0);
                }
                // If both closed: closed more recently first
                if (a.status === 'closed') {
                    if (a.closeDate && b.closeDate) return b.closeDate.localeCompare(a.closeDate);
                }
                // If both listed: listed more recently first
                if (a.status === 'listed') {
                    const dA = a.listingDate || a.closeDate || '';
                    const dB = b.listingDate || b.closeDate || '';
                    if (dA && dB) return dB.localeCompare(dA);
                }

                return (b.gmp || 0) - (a.gmp || 0);
            });
    }, [liveIpos, statusFilter, boardFilter, search]);

    const isFiltered = statusFilter !== 'all' || boardFilter !== 'all' || search !== '';

    const resetFilters = () => {
        setStatusFilter('all');
        setBoardFilter('all');
        setSearch('');
    };

    return (
        <div className="py-3 max-w-7xl mx-auto space-y-4">
            {/* Breadcrumb Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-medium">
                    <span className="text-slate-400">Home</span>
                    <span className="mx-1.5 text-slate-400">&gt;</span>
                    <span className="text-emerald-700 font-semibold">All IPOs</span>
                </div>
                <button
                    type="button"
                    onClick={loadData}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                    <ReloadOutlined spin={loading} style={{ fontSize: 11 }} />
                    <span>Sync Live ({liveIpos.length})</span>
                </button>
            </div>

            {/* Page Title & Subtitle */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight m-0">
                    All IPOs List
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Complete master directory of Mainboard and SME public offerings with live Grey Market Premium (GMP), issue prices, lot sizes, and subscription status.
                </p>
            </div>

            {/* Filter & Control Toolbar */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Status Tabs Pills */}
                    <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium overflow-x-auto max-w-full">
                        {[
                            { key: 'all', label: `All (${counts.all})` },
                            { key: 'open', label: `Open (${counts.open})` },
                            { key: 'upcoming', label: `Upcoming (${counts.upcoming})` },
                            { key: 'closed', label: `Closed (${counts.closed})` },
                            { key: 'listed', label: `Listed (${counts.listed})` },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                                    statusFilter === tab.key
                                        ? 'bg-white text-[#056a42] shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* View Switcher: Table | Grid */}
                    <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold shrink-0">
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                                viewMode === 'table'
                                    ? 'bg-white text-[#056a42] shadow-xs font-bold'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <List size={13} />
                            <span>TABLE</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                                viewMode === 'grid'
                                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <LayoutGrid size={13} />
                            <span>GRID</span>
                        </button>
                    </div>
                </div>

                {/* Sub row: Board buttons + Search + Reset */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                            Board:
                        </span>
                        {['all', 'Mainboard', 'SME'].map((b) => (
                            <button
                                key={b}
                                type="button"
                                onClick={() => setBoardFilter(b)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                    boardFilter === b
                                        ? 'bg-[#056a42] text-white shadow-2xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {b === 'all' ? 'All Boards' : b}
                            </button>
                        ))}

                        {isFiltered && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:underline font-semibold ml-2 cursor-pointer"
                            >
                                <ClearOutlined style={{ fontSize: 11 }} />
                                <span>Reset Filters</span>
                            </button>
                        )}
                    </div>

                    {/* Search Input */}
                    <Input
                        placeholder="Search company, sector, ticker..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        className="w-full sm:w-64 !rounded-md text-xs"
                    />
                </div>
            </div>

            {/* Results Counter Bar */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-500">
                <span className="font-medium">
                    Showing <strong className="text-slate-800">{filteredIPOs.length}</strong> IPO offerings
                </span>
                <span className="text-slate-400">
                    Sorted by: <span className="font-semibold text-slate-600">Active status & GMP</span>
                </span>
            </div>

            {/* Content View: Table or Grid */}
            {filteredIPOs.length > 0 ? (
                viewMode === 'table' ? (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                        <IPOGmpTable
                            ipos={filteredIPOs}
                            watchlist={watchlist}
                            onToggleWatchlist={onToggleWatchlist}
                            loading={loading}
                        />
                    </div>
                ) : (
                    <IPOGmpGrid
                        ipos={filteredIPOs}
                        watchlist={watchlist}
                        onToggleWatchlist={onToggleWatchlist}
                    />
                )
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="space-y-1">
                                <div className="text-sm font-semibold text-slate-700">
                                    No IPO offerings match these filters
                                </div>
                                <div className="text-xs text-slate-500">
                                    Try clearing your search terms or resetting filters.
                                </div>
                            </div>
                        }
                    >
                        <Button type="primary" onClick={resetFilters} className="mt-2">
                            Reset All Filters
                        </Button>
                    </Empty>
                </div>
            )}

            {/* SEO Content Section */}
            <IPOSeoContent />
        </div>
    );
}
