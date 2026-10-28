import { useState } from 'react';
import { Table, Tag, Input, Select, Button, Tooltip, Drawer, Slider, InputNumber, Statistic, Space, Dropdown } from 'antd';
import { 
    SearchOutlined, 
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
import { formatINR, formatPercentage } from '../../utils/gmp.js';

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
            return `${day1}-${day2} ${m1}`;
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
        open: { label: 'Live Open', className: 'status-open' },
        upcoming: { label: 'Upcoming', className: 'status-upcoming' },
        closed: { label: 'Closed', className: 'status-closed' },
        listed: { label: 'Listed', className: 'status-listed' },
    };

    const columns = [
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            render: (text, record) => {
                const isSME = record.board === 'SME';
                const statusInfo = statusMap[record.status] || { label: record.status, className: '' };
                return (
                    <div className="table-company-cell">
                        <div className="table-company-info">
                            <Link to={`/ipos/${record.id}`} className="company-title-link">
                                {text}
                            </Link>
                            <div className="company-status-row">
                                <span className={`company-status-text ${statusInfo.className}`}>
                                    {statusInfo.label}
                                </span>
                                <Tag color={isSME ? 'cyan' : 'green'} className="board-badge">
                                    {record.board}
                                </Tag>
                                {record.symbol && record.symbol !== '—' && (
                                    <span className="symbol-meta">{record.symbol}</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
            sorter: (a, b) => a.company.localeCompare(b.company),
        },
        {
            title: 'GMP*',
            key: 'gmp',
            width: 82,
            render: (_, record) => {
                const isPositive = record.gmp > 0;
                const isNegative = record.gmp < 0;
                return (
                    <div className="gmp-cell">
                        <span className={`gmp-val-main ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
                            {isPositive ? `+₹${record.gmp}` : isNegative ? `-₹${Math.abs(record.gmp)}` : '₹0'}
                        </span>
                    </div>
                );
            },
            sorter: (a, b) => (a.gmp || 0) - (b.gmp || 0),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Trend',
            key: 'trend',
            align: 'center',
            width: 48,
            render: (_, record) => {
                const trend = record.gmpTrend || 'neutral';
                const trendConfig = {
                    up:      { icon: <ArrowUpOutlined style={{ color: '#16a34a', fontSize: 14, fontWeight: 700 }} />, label: 'GMP Rising' },
                    down:    { icon: <ArrowDownOutlined style={{ color: '#dc2626', fontSize: 14, fontWeight: 700 }} />, label: 'GMP Falling' },
                    neutral: { icon: <MinusOutlined style={{ color: '#94a3b8', fontSize: 13 }} />, label: 'GMP Steady' },
                };
                const item = trendConfig[trend] || trendConfig.neutral;
                return (
                    <Tooltip title={item.label}>
                        <span aria-label={item.label} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.icon}
                        </span>
                    </Tooltip>
                );
            },
            sorter: (a, b) => (a.gmpTrend || '').localeCompare(b.gmpTrend || ''),
        },
        {
            title: 'Price Band',
            key: 'price',
            width: 108,
            render: (_, record) => (
                <div className="table-cell-group">
                    <span className="price-band-val">
                        {record.price ? `₹${record.price.toLocaleString('en-IN')}` : (record.priceRange || '—')}
                    </span>
                    {record.lotSize && (
                        <span className="price-lot-meta">
                            Lot: {record.lotSize} sh
                        </span>
                    )}
                </div>
            ),
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
        },
        {
            title: 'Est. Gain',
            key: 'estGain',
            width: 122,
            render: (_, record) => {
                const estPrice = record.estListingPrice || record.price || 0;
                const pct = record.gmpPercent || 0;
                const isPos = pct > 0;
                const isNeg = pct < 0;
                return (
                    <div className="est-gain-cell">
                        <span className="est-gain-val">
                            ₹{estPrice.toLocaleString('en-IN')}
                        </span>
                        <span className={`gain-pct-badge ${isPos ? 'positive' : isNeg ? 'negative' : 'neutral'}`}>
                            {isPos ? ` (+${pct}%)` : isNeg ? ` (${pct}%)` : ' (0.00%)'}
                        </span>
                    </div>
                );
            },
            sorter: (a, b) => (a.gmpPercent || 0) - (b.gmpPercent || 0),
        },
        {
            title: 'Date',
            key: 'date',
            width: 95,
            render: (_, record) => (
                <span className="table-date-text">
                    {formatShortDateRange(record.openDate, record.closeDate)}
                </span>
            ),
        },
        {
            title: '',
            key: 'actions',
            align: 'center',
            width: 40,
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
                scroll={{ x: 650 }}
                pagination={{ 
                    pageSize: 20, 
                    showSizeChanger: true, 
                    pageSizeOptions: ['20', '50', '100'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} IPOs`,
                }}
                className="custom-antd-table"
            />

            {/* Ant Design Quick Lot Profit Calculator Drawer */}
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
