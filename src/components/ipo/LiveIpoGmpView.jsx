import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Tooltip, Input, Checkbox, Switch } from 'antd';
import { 
    SearchOutlined, 
    ReloadOutlined, 
    CheckOutlined, 
    CloseOutlined, 
    ArrowUpOutlined, 
    ArrowDownOutlined 
} from '@ant-design/icons';
import { Flame } from 'lucide-react';

function formatDateDayMonth(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(`${dateStr}T12:00:00`);
        const day = d.getDate();
        const month = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d);
        return `${day}-${month}`;
    } catch {
        return dateStr;
    }
}

function formatUpdatedOn(updatedAt, updatedAtLabel) {
    if (updatedAtLabel) {
        // e.g. "30 Oct 2026, 01:48 PM IST" -> "30-Oct 13:48" or "30-Oct 15:02"
        try {
            const d = new Date(updatedAt);
            if (!isNaN(d.getTime())) {
                const day = d.getDate();
                const month = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d);
                const hours = String(d.getHours()).padStart(2, '0');
                const mins = String(d.getMinutes()).padStart(2, '0');
                return `${day}-${month} ${hours}:${mins}`;
            }
        } catch {
            // fallback
        }
        return updatedAtLabel;
    }
    if (updatedAt) {
        try {
            const d = new Date(updatedAt);
            const day = d.getDate();
            const month = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d);
            const hours = String(d.getHours()).padStart(2, '0');
            const mins = String(d.getMinutes()).padStart(2, '0');
            return `${day}-${month} ${hours}:${mins}`;
        } catch {
            return '—';
        }
    }
    return '—';
}

// Fire rating icons (🔥)
function FireRating({ percent = 0 }) {
    let fireCount = 1;
    if (percent >= 30) fireCount = 4;
    else if (percent >= 15) fireCount = 3;
    else if (percent >= 5) fireCount = 2;
    else fireCount = 1;

    return (
        <span className="inline-flex items-center gap-0.5 select-none" title={`Rating based on GMP: ${fireCount} flame${fireCount > 1 ? 's' : ''}`}>
            {Array.from({ length: fireCount }).map((_, i) => (
                <span key={i} className="text-amber-500 text-sm leading-none">🔥</span>
            ))}
        </span>
    );
}

export default function LiveIpoGmpView({ ipos = [], onRefresh, loading = false }) {
    // Checkbox filters
    const [onlyActiveGmp, setOnlyActiveGmp] = useState(false);
    const [filterMainboard, setFilterMainboard] = useState(true);
    const [filterSme, setFilterSme] = useState(true);
    const [filterOpen, setFilterOpen] = useState(true);
    const [filterClose, setFilterClose] = useState(true);
    const [filterClosingToday, setFilterClosingToday] = useState(false);
    const [filterUpcoming, setFilterUpcoming] = useState(true);
    const [filterListed, setFilterListed] = useState(false);

    // Search query & scroll toggle
    const [searchName, setSearchName] = useState('');
    const [enableScroll, setEnableScroll] = useState(false);

    const todayStr = useMemo(() => {
        return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
    }, []);

    // Summary KPIs
    const kpiStats = useMemo(() => {
        let totalCount = 0;
        let totalCr = 0;
        let upcomingCount = 0;
        let upcomingCr = 0;
        let openCount = 0;
        let openCr = 0;
        let closingTodayCount = 0;
        let closingTodayCr = 0;
        let closedCount = 0;
        let closedCr = 0;

        ipos.forEach((ipo) => {
            const o = ipo.openDate;
            const c = ipo.closeDate;
            const cr = ipo.issueSizeCr || 0;

            const isClosingToday = c === todayStr;
            const isOpen = o && o <= todayStr && c && c >= todayStr;
            const isUpcoming = o && o > todayStr;
            const isClosed = c && c < todayStr && ipo.status !== 'listed';

            if (isOpen || isUpcoming || isClosed) {
                totalCount++;
                totalCr += cr;
            }
            if (isUpcoming) {
                upcomingCount++;
                upcomingCr += cr;
            }
            if (isOpen) {
                openCount++;
                openCr += cr;
            }
            if (isClosingToday) {
                closingTodayCount++;
                closingTodayCr += cr;
            }
            if (isClosed) {
                closedCount++;
                closedCr += cr;
            }
        });

        return {
            total: { count: totalCount, cr: Math.round(totalCr) },
            upcoming: { count: upcomingCount, cr: Math.round(upcomingCr) },
            open: { count: openCount, cr: Math.round(openCr) },
            closingToday: { count: closingTodayCount, cr: Math.round(closingTodayCr) },
            closed: { count: closedCount, cr: Math.round(closedCr) },
        };
    }, [ipos, todayStr]);

    // Filter & Sort IPOs
    const filteredData = useMemo(() => {
        const query = searchName.trim().toLowerCase();

        return ipos.filter((ipo) => {
            const o = ipo.openDate;
            const c = ipo.closeDate;
            const isClosingToday = c === todayStr;
            const isOpen = ipo.status === 'open' || (o && o <= todayStr && c && c >= todayStr);
            const isUpcoming = ipo.status === 'upcoming' || (o && o > todayStr);
            const isClosed = ipo.status === 'closed' || (c && c < todayStr && ipo.status !== 'listed');
            const isListed = ipo.status === 'listed';

            // Checkbox: Only Active GMP
            if (onlyActiveGmp && (ipo.gmp == null || ipo.gmp <= 0)) {
                return false;
            }

            // Checkbox: Board Filters
            if (!filterMainboard && ipo.board === 'Mainboard') return false;
            if (!filterSme && ipo.board === 'SME') return false;

            // Checkbox: Status Filters
            if (filterClosingToday) {
                if (!isClosingToday) return false;
            } else {
                let matchesStatus = false;
                if (filterOpen && isOpen) matchesStatus = true;
                if (filterUpcoming && isUpcoming) matchesStatus = true;
                if (filterClose && isClosed) matchesStatus = true;
                if (filterListed && isListed) matchesStatus = true;
                if (!matchesStatus) return false;
            }

            // Name search
            if (query) {
                const matchStr = `${ipo.company} ${ipo.name} ${ipo.symbol || ''}`.toLowerCase();
                if (!matchStr.includes(query)) return false;
            }

            return true;
        }).sort((a, b) => {
            // Sort by lifecycle priority
            const priority = { open: 0, upcoming: 1, closed: 2, listed: 3 };
            const pDiff = (priority[a.status] ?? 4) - (priority[b.status] ?? 4);
            if (pDiff !== 0) return pDiff;

            // Ties
            if (a.status === 'open') {
                return (b.gmp || 0) - (a.gmp || 0);
            }
            if (a.status === 'upcoming') {
                if (a.openDate && b.openDate) return a.openDate.localeCompare(b.openDate);
                return (b.gmp || 0) - (a.gmp || 0);
            }
            if (a.status === 'closed') {
                if (a.closeDate && b.closeDate) return b.closeDate.localeCompare(a.closeDate);
            }
            if (a.status === 'listed') {
                const dA = a.listingDate || a.closeDate || '';
                const dB = b.listingDate || b.closeDate || '';
                return dB.localeCompare(dA);
            }
            return (b.gmp || 0) - (a.gmp || 0);
        });
    }, [
        ipos, 
        todayStr, 
        onlyActiveGmp, 
        filterMainboard, 
        filterSme, 
        filterOpen, 
        filterClose, 
        filterClosingToday, 
        filterUpcoming, 
        filterListed, 
        searchName
    ]);

    // Table Columns
    const columns = [
        {
            title: 'NAME',
            dataIndex: 'company',
            key: 'company',
            sorter: (a, b) => a.company.localeCompare(b.company),
            render: (text, record) => {
                const subType = record.subType || record.sector || (record.board === 'SME' ? 'SME' : 'IPO');
                const statusBadge = record.status === 'open' 
                    ? { letter: 'O', bg: 'bg-[#16a34a]' }
                    : record.status === 'upcoming'
                        ? { letter: 'U', bg: 'bg-[#d97706]' }
                        : record.status === 'closed'
                            ? { letter: 'C', bg: 'bg-[#0284c7]' }
                            : { letter: 'L', bg: 'bg-[#06b6d4]' };

                return (
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Link 
                            to={`/ipos/${record.id}`} 
                            className="text-[#136aa6] hover:text-[#0b4d79] font-medium hover:underline text-[13px] leading-tight"
                        >
                            {text}
                        </Link>
                        {/* Sub type tag (e.g. NSE SME, BSE SME, IPO) */}
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-500 text-white uppercase tracking-wider leading-none">
                            {subType}
                        </span>
                        {/* Status letter badge (O, U, C, L) */}
                        <span className={`w-4 h-4 rounded-full ${statusBadge.bg} text-white font-bold text-[9px] flex items-center justify-center leading-none`}>
                            {statusBadge.letter}
                        </span>
                    </div>
                );
            },
        },
        {
            title: 'GMP',
            key: 'gmp',
            align: 'center',
            sorter: (a, b) => (a.gmp || 0) - (b.gmp || 0),
            render: (_, record) => {
                const hasGmp = record.gmp != null && record.gmp > 0;
                const gmpPrice = hasGmp ? `₹${record.gmp}` : '₹--';
                const pct = hasGmp && record.gmpPercent ? `(${record.gmpPercent.toFixed(2)}%)` : '(0.00%)';
                const low = record.gmp ? Math.round(record.gmp * 0.9) : 0;
                const high = record.gmp ? Math.round(record.gmp * 1.1) : 0;

                return (
                    <div className="flex flex-col items-center leading-tight py-0.5">
                        <span className="font-bold text-slate-800 text-[13px]">
                            {gmpPrice}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                            {pct}
                        </span>
                        {hasGmp ? (
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                                <span>{low} ↓</span>
                                <span>/</span>
                                <span>{high} ↑</span>
                            </span>
                        ) : (
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                                <span>0 ↓</span>
                                <span>/</span>
                                <span>0 ↑</span>
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            title: '🔥 RATING',
            key: 'rating',
            align: 'center',
            sorter: (a, b) => (a.gmpPercent || 0) - (b.gmpPercent || 0),
            render: (_, record) => <FireRating percent={record.gmpPercent || 0} />,
        },
        {
            title: 'SUB',
            key: 'sub',
            align: 'center',
            sorter: (a, b) => (a.subscription || 0) - (b.subscription || 0),
            render: (_, record) => {
                // If the IPO has not opened yet (Upcoming) or sub data is missing/empty
                if (record.status === 'upcoming' || record.rawSubscription === null || record.rawSubscription === undefined || record.rawSubscription === '') {
                    return <span className="text-slate-400 text-xs">-</span>;
                }
                const subVal = Number(record.rawSubscription);
                if (isNaN(subVal)) {
                    return <span className="text-slate-400 text-xs">-</span>;
                }
                if (subVal === 0) {
                    return <span className="text-slate-400 text-xs">0.00x</span>;
                }
                return (
                    <span className="text-slate-800 text-xs font-semibold">
                        {subVal.toFixed(2)}x
                    </span>
                );
            },
        },
        {
            title: 'PRICE (₹)',
            key: 'price',
            align: 'center',
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            render: (_, record) => (
                <span className="text-slate-900 font-medium text-xs">
                    {record.price || (record.priceRange ? record.priceRange.replace('₹', '') : '—')}
                </span>
            ),
        },
        {
            title: 'IPO SIZE',
            key: 'issue_size',
            align: 'center',
            sorter: (a, b) => (a.issueSizeCr || 0) - (b.issueSizeCr || 0),
            render: (_, record) => (
                <span className="text-slate-800 text-xs font-medium">
                    {record.issueSizeCr > 0 ? `₹${record.issueSizeCr} Cr` : (record.offerSize || '—')}
                </span>
            ),
        },
        {
            title: 'LOT',
            key: 'lot_size',
            align: 'center',
            sorter: (a, b) => (a.lotSize || 0) - (b.lotSize || 0),
            render: (_, record) => (
                <span className="text-slate-800 text-xs">
                    {record.lotSize ? record.lotSize.toLocaleString('en-IN') : '—'}
                </span>
            ),
        },
        {
            title: 'OPEN',
            key: 'open_date',
            align: 'center',
            render: (_, record) => {
                const dateText = formatDateDayMonth(record.openDate);
                const gmpVal = record.gmp != null ? record.gmp : 0;
                return (
                    <div className="flex flex-col items-center leading-tight">
                        <span className="text-slate-800 text-xs font-medium">{dateText}</span>
                        {record.openDate && (
                            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                                GMP: {gmpVal}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'CLOSE',
            key: 'close_date',
            align: 'center',
            render: (_, record) => (
                <span className="text-slate-800 text-xs font-medium">
                    {formatDateDayMonth(record.closeDate)}
                </span>
            ),
        },
        {
            title: 'BOA DT',
            key: 'allotment_date',
            align: 'center',
            render: (_, record) => (
                <span className="text-slate-700 text-xs">
                    {formatDateDayMonth(record.allotmentDate)}
                </span>
            ),
        },
        {
            title: 'LISTING',
            key: 'listing_date',
            align: 'center',
            render: (_, record) => (
                <span className="text-slate-700 text-xs">
                    {formatDateDayMonth(record.listingDate)}
                </span>
            ),
        },
        {
            title: 'UPDATED-ON',
            key: 'updated_at',
            align: 'center',
            render: (_, record) => (
                <span className="text-[#056a42] text-[11px] font-semibold">
                    {formatUpdatedOn(record.gmpUpdatedAt, record.gmpUpdatedAtLabel)}
                </span>
            ),
        },
        {
            title: 'ANCHOR',
            key: 'anchor',
            align: 'center',
            render: (_, record) => {
                // If it's a mainboard IPO or has QIB participation, show green check
                const isAnchor = record.board === 'Mainboard' || (record.qibSub && record.qibSub > 0);
                return isAnchor ? (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-emerald-100 text-emerald-700 font-bold text-xs" title="Anchor Investors Available">
                        <CheckOutlined style={{ fontSize: 10 }} />
                    </span>
                ) : (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-red-100 text-red-500 font-bold text-xs" title="No Anchor Portion">
                        <CloseOutlined style={{ fontSize: 9 }} />
                    </span>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            {/* Top KPI Summary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 bg-white p-2.5 sm:p-3.5 rounded-lg border border-slate-200 shadow-xs">
                {/* 1. TOTAL IPOS */}
                <div className="text-center py-2 px-1 rounded-md border border-slate-100 bg-slate-50/50">
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                        {kpiStats.total.count}{' '}
                        <span className="text-xs font-semibold text-slate-500">
                            (₹{kpiStats.total.cr} Cr)
                        </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                        TOTAL IPOS
                    </div>
                </div>

                {/* 2. UPCOMING */}
                <div className="text-center py-2 px-1 rounded-md border border-amber-100 bg-amber-50/30">
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                        {kpiStats.upcoming.count}{' '}
                        <span className="text-xs font-semibold text-slate-500">
                            (₹{kpiStats.upcoming.cr} Cr)
                        </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                        <span>UPCOMING</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#d97706] text-white text-[8px] font-bold flex items-center justify-center">
                            U
                        </span>
                    </div>
                </div>

                {/* 3. OPEN */}
                <div className="text-center py-2 px-1 rounded-md border border-emerald-100 bg-emerald-50/30">
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                        {kpiStats.open.count}{' '}
                        <span className="text-xs font-semibold text-slate-500">
                            (₹{kpiStats.open.cr} Cr)
                        </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                        <span>OPEN</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white text-[8px] font-bold flex items-center justify-center">
                            O
                        </span>
                    </div>
                </div>

                {/* 4. CLOSING TODAY */}
                <div className="text-center py-2 px-1 rounded-md border border-red-100 bg-red-50/30">
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                        {kpiStats.closingToday.count}{' '}
                        <span className="text-xs font-semibold text-slate-500">
                            (₹{kpiStats.closingToday.cr} Cr)
                        </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                        <span>CLOSING TODAY</span>
                        <span className="px-1 py-0.2 rounded bg-[#dc2626] text-white text-[8px] font-bold flex items-center justify-center">
                            CT
                        </span>
                    </div>
                </div>

                {/* 5. CLOSED */}
                <div className="col-span-2 sm:col-span-1 text-center py-2 px-1 rounded-md border border-blue-100 bg-blue-50/30">
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                        {kpiStats.closed.count}{' '}
                        <span className="text-xs font-semibold text-slate-500">
                            (₹{kpiStats.closed.cr} Cr)
                        </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                        <span>CLOSED</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7] text-white text-[8px] font-bold flex items-center justify-center">
                            C
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter Checkbox Strip */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-[13px] text-slate-700">
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <Checkbox 
                        checked={onlyActiveGmp} 
                        onChange={(e) => setOnlyActiveGmp(e.target.checked)} 
                    />
                    <span>Only Active GMP</span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <Checkbox 
                        checked={filterMainboard} 
                        onChange={(e) => setFilterMainboard(e.target.checked)} 
                    />
                    <span>Mainboard</span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <Checkbox 
                        checked={filterSme} 
                        onChange={(e) => setFilterSme(e.target.checked)} 
                    />
                    <span>SME</span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <Checkbox 
                        checked={filterOpen} 
                        onChange={(e) => setFilterOpen(e.target.checked)} 
                    />
                    <span>Open</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white text-[8px] font-bold inline-flex items-center justify-center">
                        O
                    </span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <Checkbox 
                        checked={filterClose} 
                        onChange={(e) => setFilterClose(e.target.checked)} 
                    />
                    <span>Close</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7] text-white text-[8px] font-bold inline-flex items-center justify-center">
                        C
                    </span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <Checkbox 
                        checked={filterClosingToday} 
                        onChange={(e) => setFilterClosingToday(e.target.checked)} 
                    />
                    <span>Closing Today</span>
                    <span className="px-1 py-0.2 rounded bg-[#dc2626] text-white text-[8px] font-bold inline-flex items-center justify-center">
                        CT
                    </span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <Checkbox 
                        checked={filterUpcoming} 
                        onChange={(e) => setFilterUpcoming(e.target.checked)} 
                    />
                    <span>Upcoming</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#d97706] text-white text-[8px] font-bold inline-flex items-center justify-center">
                        U
                    </span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <Checkbox 
                        checked={filterListed} 
                        onChange={(e) => setFilterListed(e.target.checked)} 
                    />
                    <span>Listed</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#06b6d4] text-white text-[8px] font-bold inline-flex items-center justify-center">
                        L
                    </span>
                </label>
            </div>

            {/* Current Table Header with Search and Actions */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-3 sm:px-4 sm:py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 m-0 leading-none">
                            Current IPO GMP
                        </h2>
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <span>🗄️</span> {filteredData.length} records
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
                        {/* Name Search Input */}
                        <Input
                            placeholder="Search name..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            allowClear
                            className="flex-1 sm:w-48 !rounded-md text-xs"
                        />

                        {/* Refresh Button */}
                        <button
                            type="button"
                            onClick={() => onRefresh && onRefresh()}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shrink-0"
                        >
                            <ReloadOutlined style={{ fontSize: 11 }} />
                            <span>Refresh</span>
                        </button>

                        {/* Scroll Switch */}
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 select-none shrink-0">
                            <span>Scroll</span>
                            <Switch 
                                size="small" 
                                checked={enableScroll} 
                                onChange={(val) => setEnableScroll(val)} 
                            />
                        </div>
                    </div>
                </div>

                {/* Table Component with Light Green Table Header */}
                <div className={enableScroll ? 'overflow-x-auto' : ''}>
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        rowClassName={(_, index) => index % 2 === 1 ? 'bg-emerald-50/20' : 'bg-white'}
                        className="investorgain-style-table"
                    />
                </div>
            </div>
        </div>
    );
}

