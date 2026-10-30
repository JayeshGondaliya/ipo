import { useEffect, useState } from 'react';
import { 
    Row, 
    Col, 
    Card, 
    Tag, 
    Button, 
    Statistic, 
    Table, 
    Slider, 
    InputNumber, 
    Typography, 
    Breadcrumb, 
    Steps,
    Divider,
    Space,
    Alert
} from 'antd';
import { 
    ArrowLeftOutlined, 
    StarOutlined, 
    StarFilled, 
    RiseOutlined, 
    FallOutlined, 
    MinusOutlined, 
    CalendarOutlined, 
    CalculatorOutlined, 
    SafetyCertificateOutlined,
    LinkOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { getIpoBySlug } from '../api/ipoApi.js';
import NotFound from './NotFound.jsx';
import { formatPercentage } from '../utils/gmp.js';

const { Title, Text, Paragraph } = Typography;

function formatDate(val) {
    if (!val) return 'Not disclosed';
    try {
        return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${val}T12:00:00`));
    } catch {
        return val;
    }
}

export default function IPODetail({ watchlist = [], onToggleWatchlist }) {
    const { id } = useParams();
    const [ipo, setIpo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        if (id) {
            setLoading(true);
            getIpoBySlug(id).then((res) => {
                if (active) {
                    if (res.success && res.data) {
                        setIpo(res.data);
                    }
                    setLoading(false);
                }
            });
        }
        return () => {
            active = false;
        };
    }, [id]);

    const [lotsCount, setLotsCount] = useState(1);

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="inline-block w-8 h-8 border-4 border-[#056a42] border-t-transparent rounded-full animate-spin mb-3"></div>
                <div className="text-slate-500 text-sm font-medium">Loading IPO details from live market backend...</div>
            </div>
        );
    }

    if (!ipo) return <NotFound />;

    const isSaved = watchlist.includes(ipo.id);

    // Lot calculations
    const lotSize = ipo.lotSize || 50;
    const price = ipo.price || 100;
    const gmp = ipo.gmp || 0;
    const totalShares = lotsCount * lotSize;
    const totalInvestment = totalShares * price;
    const totalProfit = totalShares * gmp;
    const estListingPrice = price + gmp;

    // GMP History Columns
    const gmpHistoryColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (val) => formatDate(val),
        },
        {
            title: 'GMP Rate',
            dataIndex: 'gmp',
            key: 'gmp',
            render: (val) => (
                <span className="font-semibold text-emerald-600">
                    {val > 0 ? `+₹${val}` : val < 0 ? `-₹${Math.abs(val)}` : '₹0'}
                </span>
            ),
        },
        {
            title: 'Estimated Gain',
            dataIndex: 'percent',
            key: 'percent',
            render: (val) => (
                <Tag color={val > 0 ? 'success' : val < 0 ? 'error' : 'default'}>
                    {val > 0 ? `+${val}%` : `${val}%`}
                </Tag>
            ),
        },
        {
            title: 'Est. Listing Price',
            key: 'estPrice',
            render: (_, record) => `₹${price + record.gmp}`,
        },
    ];

    const statusConfig = {
        open: { color: 'green', text: 'Live Open for Bidding' },
        upcoming: { color: 'blue', text: 'Upcoming Issue' },
        closed: { color: 'orange', text: 'Closed / Allotment Phase' },
        listed: { color: 'purple', text: 'Listed on Exchanges' },
    };

    return (
        <div className="ipo-detail-page">
            {/* Breadcrumb Navigation */}
            <div className="detail-top-bar">
                <Link to="/" className="back-link">
                    <ArrowLeftOutlined /> Back to Live GMP Tracker
                </Link>
                <Button
                    type={isSaved ? 'primary' : 'default'}
                    icon={isSaved ? <StarFilled /> : <StarOutlined />}
                    onClick={() => onToggleWatchlist?.(ipo.id)}
                    className="save-watchlist-btn"
                >
                    {isSaved ? 'Saved in Watchlist' : 'Add to Watchlist'}
                </Button>
            </div>

            {/* Header Banner */}
            <div className="detail-header-card">
                <div className="header-meta-left flex items-start gap-3.5">
                    {ipo.logo && (
                        <img
                            src={ipo.logo}
                            alt={ipo.company}
                            className="w-12 h-12 rounded-lg object-contain border border-slate-200 bg-white p-1 shrink-0 mt-0.5"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="title-row">
                            <h1 className="ipo-title">{ipo.company}</h1>
                            <Tag color={ipo.board === 'SME' ? 'cyan' : 'green'} className="board-large-tag">
                                {ipo.board} IPO
                            </Tag>
                            <Tag color={statusConfig[ipo.status]?.color || 'default'} className="status-large-tag">
                                {statusConfig[ipo.status]?.text || ipo.status}
                            </Tag>
                        </div>
                        <div className="subtitle-row">
                            <span className="symbol-pill">Symbol: <strong>{ipo.symbol}</strong></span>
                            <span className="divider-dot">•</span>
                            <span className="sector-pill">Sector: <strong>{ipo.sector}</strong></span>
                            <span className="divider-dot">•</span>
                            <span>Offer Type: <strong>{ipo.offerType?.toUpperCase() || 'IPO'}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* GMP & Valuation Highlights */}
            <div className="gmp-metrics-highlight-grid">
                <div className="highlight-metric-box gmp-primary">
                    <span className="metric-box-title">Live Grey Market Premium (GMP)</span>
                    <div className="gmp-big-figure">
                        <span className="gmp-curr-symbol">₹</span>
                        <span className="gmp-num">{ipo.gmp > 0 ? `+${ipo.gmp}` : ipo.gmp}</span>
                        <span className="gmp-pct-pill">
                            {formatPercentage(ipo.gmpPercent)}
                        </span>
                    </div>
                    <span className="metric-box-note">Expected listing premium per equity share</span>
                </div>

                <div className="highlight-metric-box">
                    <span className="metric-box-title">Issue Price</span>
                    <div className="metric-big-num">₹{ipo.price}</div>
                    <span className="metric-box-note">Band: {ipo.priceRange}</span>
                </div>

                <div className="highlight-metric-box">
                    <span className="metric-box-title">Estimated Listing Price</span>
                    <div className="metric-big-num text-emerald-700">₹{estListingPrice}</div>
                    <span className="metric-box-note">Issue Price (₹{ipo.price}) + GMP (₹{ipo.gmp})</span>
                </div>

                <div className="highlight-metric-box">
                    <span className="metric-box-title">Expected Profit per Lot</span>
                    <div className="metric-big-num text-emerald-600">
                        ₹{(ipo.estProfitPerLot || 0).toLocaleString('en-IN')}
                    </div>
                    <span className="metric-box-note">Lot Size: {lotSize} shares</span>
                </div>
            </div>

            <Row gutter={[24, 24]} className="detail-body-row">
                {/* Left Column: Timeline, GMP History & Subscription */}
                <Col xs={24} lg={16}>
                    {/* Important Dates Timeline */}
                    <Card title={<><CalendarOutlined /> Key IPO Dates & Schedule</>} className="content-card">
                        <div className="timeline-grid">
                            <div className="timeline-step">
                                <span className="step-name">Bidding Opens</span>
                                <span className="step-date">{formatDate(ipo.openDate)}</span>
                                <span className="step-status done">Start Date</span>
                            </div>
                            <div className="timeline-step">
                                <span className="step-name">Bidding Closes</span>
                                <span className="step-date">{formatDate(ipo.closeDate)}</span>
                                <span className="step-status">Closing Day</span>
                            </div>
                            <div className="timeline-step">
                                <span className="step-name">Allotment Date</span>
                                <span className="step-date">
                                    {ipo.closeDate ? formatDate(ipo.closeDate) : 'TBA'}
                                </span>
                                <span className="step-status">Basis of Allotment</span>
                            </div>
                            <div className="timeline-step">
                                <span className="step-name">Listing Date</span>
                                <span className="step-date">{formatDate(ipo.listingDate)}</span>
                                <span className="step-status highlight">BSE / NSE Debut</span>
                            </div>
                        </div>
                    </Card>

                    {/* GMP Trend History Table */}
                    <Card 
                        title={<><RiseOutlined /> Day-Wise GMP Trend History</>} 
                        className="content-card mt-6"
                        extra={<span className="text-xs text-slate-500">Updated Daily</span>}
                    >
                        <Table
                            dataSource={ipo.gmpHistory || []}
                            columns={gmpHistoryColumns}
                            rowKey="date"
                            pagination={false}
                            size="middle"
                        />
                    </Card>

                    {/* Subscription Breakdown */}
                    <Card 
                        title={<><SafetyCertificateOutlined /> Bidding & Subscription Demand</>} 
                        className="content-card mt-6"
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={12} sm={6}>
                                <div className="sub-category-card">
                                    <span className="cat-title">QIB Category</span>
                                    <span className="cat-value">{ipo.qibSub > 0 ? `${ipo.qibSub}×` : '—'}</span>
                                    <span className="cat-sub">Institutions</span>
                                </div>
                            </Col>
                            <Col xs={12} sm={6}>
                                <div className="sub-category-card">
                                    <span className="cat-title">NII / HNI</span>
                                    <span className="cat-value">{ipo.niiSub > 0 ? `${ipo.niiSub}×` : '—'}</span>
                                    <span className="cat-sub">High Networth</span>
                                </div>
                            </Col>
                            <Col xs={12} sm={6}>
                                <div className="sub-category-card">
                                    <span className="cat-title">Retail (RII)</span>
                                    <span className="cat-value">{ipo.retailSub > 0 ? `${ipo.retailSub}×` : '—'}</span>
                                    <span className="cat-sub">Individual</span>
                                </div>
                            </Col>
                            <Col xs={12} sm={6}>
                                <div className="sub-category-card total">
                                    <span className="cat-title">Total Demand</span>
                                    <span className="cat-value highlight">
                                        {ipo.subscription > 0 ? `${ipo.subscription.toFixed(2)}×` : 'Awaiting'}
                                    </span>
                                    <span className="cat-sub">Overall Subscription</span>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Company Profile / Description */}
                    {ipo.description && (
                        <Card title="About the Company" className="content-card mt-6">
                            <Paragraph className="company-desc-text">
                                {ipo.description}
                            </Paragraph>
                        </Card>
                    )}
                </Col>

                {/* Right Column: Interactive Lot Profit Calculator & Quick Specs */}
                <Col xs={24} lg={8}>
                    {/* Profit Calculator */}
                    <Card 
                        title={<><CalculatorOutlined /> IPO Lot & Profit Calculator</>} 
                        className="content-card calculator-sidebar-card"
                    >
                        <div className="calc-sidebar-body">
                            <div className="lots-selector-group">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-slate-700">Application Size:</label>
                                    <span className="text-xs text-slate-500">{lotsCount} Lot ({totalShares} Shares)</span>
                                </div>
                                <Slider
                                    min={1}
                                    max={15}
                                    value={lotsCount}
                                    onChange={(v) => setLotsCount(v)}
                                />
                                <div className="quick-lots-buttons">
                                    {[1, 2, 5, 10, 13].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`quick-lot-btn ${lotsCount === num ? 'active' : ''}`}
                                            onClick={() => setLotsCount(num)}
                                        >
                                            {num} {num === 1 ? 'Lot' : 'Lots'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Divider style={{ margin: '16px 0' }} />

                            <div className="calc-result-rows">
                                <div className="calc-result-line">
                                    <span>Investment Required:</span>
                                    <strong>₹{totalInvestment.toLocaleString('en-IN')}</strong>
                                </div>
                                <div className="calc-result-line">
                                    <span>Issue Price per Share:</span>
                                    <span>₹{price}</span>
                                </div>
                                <div className="calc-result-line">
                                    <span>GMP per Share:</span>
                                    <span className="text-emerald-600 font-semibold">+₹{gmp}</span>
                                </div>
                                <div className="calc-result-line highlight">
                                    <span>Estimated Listing Gain:</span>
                                    <span className="text-emerald-700 font-bold text-lg">
                                        +₹{totalProfit.toLocaleString('en-IN')} ({formatPercentage(ipo.gmpPercent)})
                                    </span>
                                </div>
                            </div>

                            <Alert
                                message="Grey Market Disclaimer"
                                description="GMP rates are unofficial OTC transactions. Actual listing price on BSE/NSE may vary depending on market sentiment."
                                type="info"
                                showIcon
                                className="mt-4 text-xs"
                            />
                        </div>
                    </Card>

                    {/* Quick Facts Card */}
                    <Card title="Offering Parameters" className="content-card mt-6">
                        <div className="facts-list">
                            <div className="fact-item">
                                <span className="fact-label">Issue Size</span>
                                <span className="fact-val">{ipo.offerSize}</span>
                            </div>
                            <div className="fact-item">
                                <span className="fact-label">Face Value</span>
                                <span className="fact-val">₹10 per share</span>
                            </div>
                            <div className="fact-item">
                                <span className="fact-label">Minimum Lot</span>
                                <span className="fact-val">{lotSize} shares</span>
                            </div>
                            <div className="fact-item">
                                <span className="fact-label">Exchange Listing</span>
                                <span className="fact-val">{ipo.board === 'SME' ? 'BSE SME / NSE Emerge' : 'BSE & NSE Mainboard'}</span>
                            </div>
                        </div>

                        <Divider style={{ margin: '16px 0' }} />

                        <Link to="/dashboard" style={{ width: '100%', display: 'block' }}>
                            <Button type="dashed" block icon={<LinkOutlined />}>
                                Check Allotment on Registrars
                            </Button>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}