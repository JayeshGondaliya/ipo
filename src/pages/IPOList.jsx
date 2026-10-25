import { useMemo, useState } from 'react';
import { Tabs, Select, Input, Radio, Typography, Tag, Space, Empty } from 'antd';
import { SearchOutlined, CalendarOutlined, SlidersOutlined } from '@ant-design/icons';
import IPOGmpTable from '../components/ipo/IPOGmpTable.jsx';
import { calendarMonthsList, getIposForMonth, latestCalendarMonth } from '../data/ipos.js';

const { Title, Text } = Typography;

export default function IPOList({ watchlist = [], onToggleWatchlist }) {
    const [status, setStatus] = useState('all');
    const [board, setBoard] = useState('all');
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState(latestCalendarMonth);

    const monthIPOs = getIposForMonth(month);

    const filteredIPOs = useMemo(() => {
        const query = search.trim().toLowerCase();
        return monthIPOs
            .filter((ipo) => (status === 'all' || ipo.status === status))
            .filter((ipo) => (board === 'all' || ipo.board === board))
            .filter((ipo) => !query || `${ipo.company} ${ipo.symbol} ${ipo.sector} ${ipo.exchange}`.toLowerCase().includes(query))
            .sort((a, b) => (b.gmpPercent || 0) - (a.gmpPercent || 0));
    }, [monthIPOs, search, status, board]);

    const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(`${month}-01T12:00:00`));

    return (
        <div className="page-container">
            <div className="page-heading-row">
                <div>
                    <span className="eyebrow"><CalendarOutlined /> IPO ARCHIVE & CALENDAR</span>
                    <h1 className="page-title">IPO Calendar · {monthLabel}</h1>
                    <p className="page-subtitle">Browse monthly IPO offerings with live GMP, subscription, and allotment dates.</p>
                </div>
                <Tag color="success" className="count-tag">
                    {filteredIPOs.length} {filteredIPOs.length === 1 ? 'offering' : 'offerings'} found
                </Tag>
            </div>

            <div className="calendar-controls-bar">
                <Tabs
                    activeKey={status}
                    onChange={(key) => setStatus(key)}
                    items={[
                        { key: 'all', label: 'All Status' },
                        { key: 'open', label: 'Open' },
                        { key: 'upcoming', label: 'Upcoming' },
                        { key: 'closed', label: 'Closed' },
                        { key: 'listed', label: 'Listed' },
                    ]}
                    className="status-tabs"
                />

                <div className="calendar-filters-row">
                    <Radio.Group
                        value={board}
                        onChange={(e) => setBoard(e.target.value)}
                        buttonStyle="solid"
                        size="middle"
                    >
                        <Radio.Button value="all">All</Radio.Button>
                        <Radio.Button value="Mainboard">Mainboard</Radio.Button>
                        <Radio.Button value="SME">SME</Radio.Button>
                    </Radio.Group>

                    <Select
                        value={month}
                        onChange={(val) => setMonth(val)}
                        style={{ minWidth: 180 }}
                        options={calendarMonthsList.map((val) => ({
                            value: val,
                            label: new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(`${val}-01T12:00:00`)),
                        }))}
                    />

                    <Input
                        placeholder="Search company or ticker..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        style={{ maxWidth: 260 }}
                    />
                </div>
            </div>

            {filteredIPOs.length ? (
                <IPOGmpTable
                    ipos={filteredIPOs}
                    watchlist={watchlist}
                    onToggleWatchlist={onToggleWatchlist}
                />
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={`No offerings match these filters in ${monthLabel}. Try another month or adjust filters.`}
                />
            )}
        </div>
    );
}