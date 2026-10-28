import { useState } from 'react';
import { Table, Tag, Button, Tooltip, Drawer, Slider, InputNumber, Statistic, Dropdown } from 'antd';
import { 
    CalculatorOutlined, 
    StarOutlined, 
    StarFilled, 
    ArrowUpOutlined, 
    ArrowDownOutlined, 
    MinusOutlined,
    EyeOutlined,
    MoreOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatPercentage } from '../../utils/gmp.js';

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
        <span className="inline-flex items-center gap-0.5 text-amber-500 text-[13px] leading-none select-none" title={`Rating: ${filled}/5 based on GMP strength`}>
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

function formatDate(val) {
    if (!val) return '—';
    try {
        return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(`${val}T12:00:00`));
    } catch {
        return val;
    }
}

function formatShortDateRange(openVal, closeVal) {
    if (!openVal && !closeVal) return 'Upcoming';
    if (!openVal) return formatDate(closeVal);
    if (!closeVal) return formatDate(openVal);
    try {
        const d1 = new Date(`${openVal}T12:00:00`);
        const d2 = new Date(`${closeVal}T12:00:00`);
        const day1 = d1.getDate();
        const day2 = d2.getDate();
        const m1 = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d1);
        const m2 = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d2);
        if (m1 === m2) {
            return `${day1} - ${day2} ${m1}`;
        }
        return `${day1} ${m1} - ${day2} ${m2}`;
    } catch {
        return `${openVal} - ${closeVal}`;
    }
}

export default function IPOGmpTable({ ipos = [], watchlist = [], onToggleWatchlist }) {
    const [calcIpo, setCalcIpo] = useState(null);
    const [calcLots, setCalcLots] = useState(1);

    const openCalculator = (ipo) => {
        setCalcIpo(ipo);
        setCalcLots(1);
    };

    const closeCalculator = () => {
        setCalcIpo(null);
    };

    const statusMap = {
        open: { label: 'LIVE OPEN', bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        upcoming: { label: 'UPCOMING', bgClass: 'bg-amber-50 text-amber-700 border-amber-200/70' },
        closed: { label: 'CLOSED', bgClass: 'bg-slate-100 text-slate-600 border-slate-200' },
        listed: { label: 'LISTED', bgClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    };

    const columns = [
        {
            title: 'COMPANY',
            dataIndex: 'company',
            key: 'company',
            render: (text, record) => {
                const isSME = record.board === 'SME';
                const statusInfo = statusMap[record.status] || { label: (record.status || '').toUpperCase(), bgClass: 'bg-slate-100 text-slate-600 border-slate-200' };
                const sectorName = record.sector && record.sector !== 'Diversified' && record.sector !== 'SME Growth'
                    ? record.sector
                    : (isSME ? 'SME ENTERPRISE' : 'MAINBOARD');

                return (
                    <div className="table-company-cell flex items-start gap-2.5">
                        {record.logo ? (
                            <img
                                src={record.logo}
                                alt={record.company}
                                className="w-8 h-8 rounded-md object-contain border border-slate-200 bg-white p-0.5 shrink-0 mt-0.5"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-md bg-emerald-50 text-[#056a42] font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                                {record.initials || record.company?.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div className="table-company-info min-w-0">
                            <Link to={`/ipos/${record.id}`} className="company-title-link">
                                {text}
                            </Link>
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none mt-0.5 block truncate">
                                {sectorName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 leading-tight">
                                    {record.board}
                                </span>
                                <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border leading-tight ${statusInfo.bgClass}`}>
                                    {statusInfo.label}
                                </span>
                                {record.symbol && record.symbol !== '—' && (
                                    <span className="text-[10px] text-slate-400 font-mono">{record.symbol}</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
            sorter: (a, b) => a.company.localeCompare(b.company),
        },
        {
            title: 'GMP',
            key: 'gmp',
            width: 120,
            render: (_, record) => {
                const isPositive = record.gmp > 0;
                const isNegative = record.gmp < 0;
                const pct = record.gmpPercent || 0;
                const estPrice = record.estListingPrice || (record.price ? record.price + (record.gmp || 0) : 0);

                return (
                    <div className="flex flex-col items-start gap-0.5">
                        <span className={`text-[15px] font-bold leading-tight ${isPositive ? 'text-emerald-700' : isNegative ? 'text-red-600' : 'text-slate-800'}`}>
                            {isPositive ? `+₹${record.gmp}` : isNegative ? `-₹${Math.abs(record.gmp)}` : '₹0'}
                        </span>
                        <span className={`text-xs font-semibold leading-tight ${isPositive ? 'text-emerald-700' : isNegative ? 'text-red-600' : 'text-slate-500'}`}>
                            {isPositive ? `+${pct}% est.` : isNegative ? `${pct}% est.` : '0.00% est.'}
                        </span>
                        {estPrice > 0 && (
                            <span className="text-[10.5px] text-slate-400 leading-tight">
                                Est. ₹{estPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                );
            },
            sorter: (a, b) => (a.gmp || 0) - (b.gmp || 0),
            defaultSortOrder: 'descend',
        },
        {
            title: 'GMP RATING',
            key: 'rating',
            width: 130,
            align: 'center',
            render: (_, record) => {
                const trend = record.gmpTrend || 'neutral';
                const trendConfig = {
                    up:      { icon: <ArrowUpOutlined style={{ color: '#16a34a', fontSize: 13, fontWeight: 700 }} />, label: 'GMP Rising', text: 'Rising' },
                    down:    { icon: <ArrowDownOutlined style={{ color: '#dc2626', fontSize: 13, fontWeight: 700 }} />, label: 'GMP Falling', text: 'Falling' },
                    neutral: { icon: <MinusOutlined style={{ color: '#94a3b8', fontSize: 12 }} />, label: 'GMP Steady', text: 'Steady' },
                };
                const item = trendConfig[trend] || trendConfig.neutral;

                return (
                    <div className="flex flex-col items-center justify-center gap-1">
                        <StarRating percent={record.gmpPercent || 0} />
                        <Tooltip title={item.label}>
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                                {item.icon}
                                <span>{item.text}</span>
                            </span>
                        </Tooltip>
                    </div>
                );
            },
            sorter: (a, b) => (a.gmpPercent || 0) - (b.gmpPercent || 0),
        },
        {
            title: 'PRICE BAND',
            key: 'price',
            width: 115,
            render: (_, record) => (
                <div className="table-cell-group">
                    <span className="price-band-val font-semibold text-slate-900">
                        {record.price ? `₹${record.price.toLocaleString('en-IN')}` : (record.priceRange || '—')}
                    </span>
                    {record.lotSize && (
                        <span className="text-xs text-slate-500">
                            Lot: {record.lotSize} sh
                        </span>
                    )}
                </div>
            ),
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
        },
        {
            title: 'PERIOD',
            key: 'period',
            width: 115,
            render: (_, record) => (
                <span className="table-date-text text-[13px] font-medium text-slate-700 whitespace-nowrap">
                    {formatShortDateRange(record.openDate, record.closeDate)}
                </span>
            ),
        },
        {
            title: '',
            key: 'actions',
            align: 'center',
            width: 44,
            render: (_, record) => {
                const isSaved = watchlist.includes(record.id);
                const menuItems = [
                    {
                        key: 'calc',
                        icon: <CalculatorOutlined style={{ color: '#056a42', fontSize: '14px' }} />,
                        label: 'Calculate Lot Profit',
                        onClick: () => openCalculator(record),
                    },
                    {
                        key: 'watchlist',
                        icon: isSaved ? (
                            <StarFilled style={{ color: '#eab308', fontSize: '14px' }} />
                        ) : (
                            <StarOutlined style={{ color: '#64748b', fontSize: '14px' }} />
                        ),
                        label: isSaved ? 'Remove from Watchlist' : 'Add to Watchlist',
                        onClick: () => onToggleWatchlist?.(record.id),
                    },
                    {
                        type: 'divider',
                    },
                    {
                        key: 'details',
                        icon: <EyeOutlined style={{ color: '#0284c7', fontSize: '14px' }} />,
                        label: <Link to={`/ipos/${record.id}`}>View IPO Details</Link>,
                    },
                ];

                return (
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            size="small"
                            className="!w-8 !h-8 !inline-flex !items-center !justify-center !text-slate-500 hover:!text-slate-800 hover:!bg-slate-100 !rounded-md"
                            icon={<MoreOutlined style={{ fontSize: '16px' }} />}
                            title="Actions"
                            aria-label={`Actions for ${record.company}`}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    // Calculator calculations
    const selectedLotSize = calcIpo ? calcIpo.lotSize : 50;
    const selectedPrice = calcIpo ? calcIpo.price : 100;
    const selectedGmp = calcIpo ? calcIpo.gmp : 0;
    const totalShares = calcLots * selectedLotSize;
    const totalInvestment = totalShares * selectedPrice;
    const estimatedProfit = totalShares * selectedGmp;
    const estListingVal = selectedPrice + selectedGmp;

    return (
        <div className="ipogmp-table-wrapper">
            <Table
                dataSource={ipos}
                columns={columns}
                rowKey="id"
                scroll={{ x: 640 }}
                pagination={{ 
                    pageSize: 20, 
                    showSizeChanger: true, 
                    pageSizeOptions: ['20', '50', '100'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} IPOs`,
                }}
                className="custom-antd-table"
            />

            {/* Quick Lot Profit Calculator Drawer */}
            <Drawer
                title={
                    <div className="drawer-title-box">
                        <CalculatorOutlined style={{ color: '#056a42', marginRight: 8 }} />
                        <span>IPO Profit Calculator: {calcIpo?.company}</span>
                    </div>
                }
                placement="right"
                onClose={closeCalculator}
                open={Boolean(calcIpo)}
                width={420}
            >
                {calcIpo && (
                    <div className="calculator-drawer-content">
                        <div className="calc-summary-card">
                            <div className="calc-row">
                                <span className="calc-label">Issue Price:</span>
                                <span className="calc-val">₹{calcIpo.price}</span>
                            </div>
                            <div className="calc-row">
                                <span className="calc-label">Live GMP:</span>
                                <span className="calc-val green">
                                    +₹{calcIpo.gmp} ({formatPercentage(calcIpo.gmpPercent)})
                                </span>
                            </div>
                            <div className="calc-row">
                                <span className="calc-label">Estimated Listing:</span>
                                <span className="calc-val bold">₹{estListingVal}</span>
                            </div>
                            <div className="calc-row">
                                <span className="calc-label">Lot Size:</span>
                                <span className="calc-val">{calcIpo.lotSize} shares / lot</span>
                            </div>
                        </div>

                        <div className="calc-input-section">
                            <label className="input-section-label">Select Number of Lots:</label>
                            <div className="slider-control-row">
                                <Slider
                                    min={1}
                                    max={20}
                                    value={calcLots}
                                    onChange={(val) => setCalcLots(val)}
                                    style={{ flex: 1, marginRight: 16 }}
                                />
                                <InputNumber
                                    min={1}
                                    max={50}
                                    value={calcLots}
                                    onChange={(val) => setCalcLots(val || 1)}
                                />
                            </div>
                        </div>

                        <div className="calc-results-box">
                            <div className="result-stat-item">
                                <Statistic
                                    title="Total Shares Applied"
                                    value={totalShares}
                                    suffix="Shares"
                                />
                            </div>
                            <div className="result-stat-item">
                                <Statistic
                                    title="Total Investment"
                                    value={totalInvestment}
                                    prefix="₹"
                                    formatter={(val) => Number(val).toLocaleString('en-IN')}
                                />
                            </div>
                            <div className="result-stat-item highlight-green">
                                <Statistic
                                    title="Estimated Listing Profit"
                                    value={estimatedProfit}
                                    prefix="₹"
                                    valueStyle={{ color: '#056a42', fontWeight: 600 }}
                                    formatter={(val) => Number(val).toLocaleString('en-IN')}
                                />
                            </div>
                        </div>

                        <div className="calc-disclaimer-note">
                            * Note: GMP figures are unofficial market estimates. Allotment is subject to subscription demand.
                        </div>

                        <div className="drawer-actions-row">
                            <Link to={`/ipos/${calcIpo.id}`} style={{ width: '100%' }}>
                                <Button type="primary" block size="large">
                                    View Full IPO Analysis
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
