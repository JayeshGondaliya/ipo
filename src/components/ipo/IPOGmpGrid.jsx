import { useState } from 'react';
import { Button, Tag, Tooltip, Drawer } from 'antd';
import { 
    CalculatorOutlined, 
    StarOutlined, 
    StarFilled, 
    ArrowUpOutlined, 
    ArrowDownOutlined, 
    MinusOutlined,
    EyeOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

function StarRating({ percent = 0 }) {
    let filled = 3;
    if (percent >= 50) filled = 5;
    else if (percent >= 25) filled = 4.5;
    else if (percent >= 10) filled = 4;
    else if (percent > 0) filled = 3.5;
    else if (percent === 0) filled = 3;
    else filled = 2;

    const fullStars = Math.floor(filled);
    const hasHalf = filled % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <span className="inline-flex items-center gap-0.5 text-amber-500 text-xs leading-none select-none" title={`Rating: ${filled}/5 based on GMP`}>
            {Array.from({ length: fullStars }).map((_, i) => (
                <span key={`f-${i}`}>★</span>
            ))}
            {hasHalf && (
                <span key="half" className="opacity-75">★</span>
            )}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <span key={`e-${i}`} className="text-slate-200">★</span>
            ))}
        </span>
    );
}

function formatShortDateRange(openVal, closeVal) {
    if (!openVal && !closeVal) return 'Upcoming';
    const formatDate = (val) => {
        try {
            return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(`${val}T12:00:00`));
        } catch {
            return val;
        }
    };
    if (!openVal) return formatDate(closeVal);
    if (!closeVal) return formatDate(openVal);
    try {
        const d1 = new Date(`${openVal}T12:00:00`);
        const d2 = new Date(`${closeVal}T12:00:00`);
        const day1 = d1.getDate();
        const day2 = d2.getDate();
        const m1 = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d1);
        const m2 = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d2);
        if (m1 === m2) return `${day1}-${day2} ${m1}`;
        return `${day1} ${m1} - ${day2} ${m2}`;
    } catch {
        return `${openVal} - ${closeVal}`;
    }
}

export default function IPOGmpGrid({ ipos = [], watchlist = [], onToggleWatchlist, onOpenCalculator }) {
    const statusMap = {
        open: { label: 'Live Open', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        upcoming: { label: 'Upcoming', className: 'bg-amber-50 text-amber-700 border-amber-200' },
        closed: { label: 'Closed', className: 'bg-slate-100 text-slate-600 border-slate-200' },
        listed: { label: 'Listed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    };

    if (!ipos.length) {
        return (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
                No IPOs match your current selection.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {ipos.map((ipo) => {
                const isSME = ipo.board === 'SME';
                const statusInfo = statusMap[ipo.status] || { label: ipo.status, className: 'bg-slate-100 text-slate-600' };
                const isPositive = ipo.gmp > 0;
                const isNegative = ipo.gmp < 0;
                const pct = ipo.gmpPercent || 0;
                const isSaved = watchlist.includes(ipo.id);
                const trend = ipo.gmpTrend || 'neutral';
                const trendIcon = trend === 'up'
                    ? <ArrowUpOutlined style={{ color: '#16a34a', fontSize: 12 }} />
                    : trend === 'down'
                        ? <ArrowDownOutlined style={{ color: '#dc2626', fontSize: 12 }} />
                        : <MinusOutlined style={{ color: '#94a3b8', fontSize: 11 }} />;

                return (
                    <div 
                        key={ipo.id} 
                        className="bg-white border border-slate-200 rounded-lg p-3.5 hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                        {/* Top: Sector & Badges */}
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                    {ipo.sector || (isSME ? 'SME GROWTH' : 'MAINBOARD')}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                        {ipo.board}
                                    </span>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${statusInfo.className}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                            </div>

                            {/* Title Row with Logo */}
                            <div className="flex items-center gap-2.5 mb-3">
                                {ipo.logo ? (
                                    <img 
                                        src={ipo.logo} 
                                        alt={ipo.company} 
                                        className="w-8 h-8 rounded-md object-contain border border-slate-200 bg-white p-0.5 shrink-0"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-md bg-emerald-50 text-[#056a42] font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100">
                                        {ipo.initials || ipo.company?.slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <Link 
                                    to={`/ipos/${ipo.id}`} 
                                    className="text-[14.5px] font-bold text-slate-900 hover:text-[#056a42] hover:underline leading-snug line-clamp-1 block flex-1"
                                >
                                    {ipo.company}
                                </Link>
                            </div>

                            {/* GMP Value Banner */}
                            <div className="bg-slate-50 border border-slate-100 rounded-md p-2.5 flex items-center justify-between mb-3">
                                <div>
                                    <span className="text-[10.5px] text-slate-500 block leading-tight font-medium">Estimated GMP</span>
                                    <span className={`text-base font-bold leading-tight ${isPositive ? 'text-emerald-700' : isNegative ? 'text-red-600' : 'text-slate-700'}`}>
                                        {isPositive ? `+₹${ipo.gmp}` : isNegative ? `-₹${Math.abs(ipo.gmp)}` : '₹0'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10.5px] text-slate-500 block leading-tight font-medium">Est. Gain</span>
                                    <span className={`text-xs font-bold ${isPositive ? 'text-emerald-700' : isNegative ? 'text-red-600' : 'text-slate-600'}`}>
                                        {isPositive ? `+${pct}%` : `${pct}%`}
                                    </span>
                                </div>
                            </div>

                            {/* Key Stats Grid */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 border-t border-slate-100 pt-2.5">
                                <div>
                                    <span className="text-[10.5px] text-slate-400 block">Price Band</span>
                                    <span className="font-semibold text-slate-800">
                                        {ipo.price ? `₹${ipo.price}` : (ipo.priceRange || '—')}
                                    </span>
                                    {ipo.lotSize && (
                                        <span className="text-[10.5px] text-slate-400 block">Lot: {ipo.lotSize} sh</span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10.5px] text-slate-400 block">Period</span>
                                    <span className="font-semibold text-slate-800 block">
                                        {formatShortDateRange(ipo.openDate, ipo.closeDate)}
                                    </span>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <StarRating percent={pct} />
                                        <span>{trendIcon}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Bottom Bar */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => onToggleWatchlist?.(ipo.id)}
                                className="text-xs text-slate-500 hover:text-amber-500 inline-flex items-center gap-1 py-1"
                            >
                                {isSaved ? (
                                    <StarFilled className="text-amber-500" />
                                ) : (
                                    <StarOutlined />
                                )}
                                <span>{isSaved ? 'Saved' : 'Watchlist'}</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                                <Button
                                    size="small"
                                    icon={<CalculatorOutlined />}
                                    onClick={() => onOpenCalculator?.(ipo)}
                                    className="!text-xs !font-medium"
                                >
                                    Calc
                                </Button>
                                <Link to={`/ipos/${ipo.id}`}>
                                    <Button
                                        size="small"
                                        type="primary"
                                        className="!text-xs !bg-[#056a42] hover:!bg-[#045233]"
                                    >
                                        Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

