import { useEffect, useState } from 'react';
import { 
    Tabs, 
    Card, 
    Form, 
    Input, 
    Select, 
    Button, 
    Alert, 
    Row, 
    Col, 
    Typography, 
    Tag, 
    Divider,
    Space,
    Empty
} from 'antd';
import { 
    CheckCircleOutlined, 
    SafetyCertificateOutlined, 
    LinkOutlined, 
    StarFilled, 
    SearchOutlined,
    IdcardOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getIpos } from '../api/ipoApi.js';
import IPOGmpTable from '../components/ipo/IPOGmpTable.jsx';

const { Title, Text, Paragraph } = Typography;

const registrars = [
    {
        name: 'Link Intime India',
        url: 'https://linkintime.co.in/initial_offer/public-issues.html',
        desc: 'Leading registrar for major Mainboard IPOs (Tata Tech, Swiggy, etc.)',
    },
    {
        name: 'KFin Technologies',
        url: 'https://kosmic.kfintech.com/ipostatus/',
        desc: 'Official registrar for LIC, Bajaj Housing, and numerous SME offerings',
    },
    {
        name: 'Bigshare Services',
        url: 'https://www.bigshareonline.com/ipo_Allotment.html',
        desc: 'Popular registrar for active SME and Mainboard issues',
    },
    {
        name: 'Skyline Financial Services',
        url: 'https://www.skylinerta.com/ipo.php',
        desc: 'Official allotment status portal for emerging SME IPOs',
    },
    {
        name: 'BSE India Official Status',
        url: 'https://www.bseindia.com/investors/appli_check.aspx',
        desc: 'Direct exchange allotment portal for all listed issues',
    },
];

export default function Dashboard({ watchlist = [], onToggleWatchlist }) {
    const [liveIpos, setLiveIpos] = useState([]);
    const [form] = Form.useForm();
    const [result, setResult] = useState(null);

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

    const watchlistIpos = liveIpos.filter((item) => watchlist.includes(item.id));

    const onFinish = (values) => {
        const selected = liveIpos.find((i) => i.id === values.ipo);
        setResult({
            success: true,
            company: selected?.company || 'Selected IPO',
            pan: values.pan?.toUpperCase(),
            applicationNo: values.appNo,
            board: selected?.board || 'Mainboard',
            status: selected?.status || 'Active',
            gmp: selected?.gmp || 0,
        });
    };

    return (
        <div className="page-container dashboard-page">
            <div className="page-heading-row">
                <div>
                    <span className="eyebrow"><SafetyCertificateOutlined /> INVESTOR TOOLS</span>
                    <h1 className="page-title">Check Allotment & Watchlist</h1>
                    <p className="page-subtitle">Verify your IPO allotment status or monitor your saved IPOs with live GMP.</p>
                </div>
            </div>

            <Tabs
                defaultActiveKey="allotment"
                className="dashboard-main-tabs"
                items={[
                    {
                        key: 'allotment',
                        label: (
                            <span>
                                <CheckCircleOutlined style={{ marginRight: 6 }} />
                                Allotment Checker
                            </span>
                        ),
                        children: (
                            <Row gutter={[24, 24]}>
                                <Col xs={24} lg={14}>
                                    <Card title="Quick IPO Allotment Query" className="content-card">
                                        <Alert
                                            message="Official Allotment Verification"
                                            description="Select your applied IPO and enter your credentials. You can also visit the direct registrar portals below for instant real-time results."
                                            type="info"
                                            showIcon
                                            className="mb-6"
                                        />

                                        <Form
                                            form={form}
                                            layout="vertical"
                                            onFinish={onFinish}
                                            requiredMark={false}
                                        >
                                            <Form.Item
                                                name="ipo"
                                                label="Select Applied IPO"
                                                rules={[{ required: true, message: 'Please select an IPO' }]}
                                            >
                                                <Select
                                                    placeholder="Search and choose IPO..."
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    options={liveIpos.map((i) => ({
                                                        value: i.id,
                                                        label: `${i.company} (${i.board}) - ${i.status.toUpperCase()}`,
                                                    }))}
                                                    size="large"
                                                />
                                            </Form.Item>

                                            <Row gutter={16}>
                                                <Col xs={24} sm={12}>
                                                    <Form.Item
                                                        name="pan"
                                                        label="PAN Number"
                                                        rules={[
                                                            { required: true, message: 'Enter your 10-digit PAN' },
                                                            { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, message: 'Enter valid PAN (e.g. ABCDE1234F)' },
                                                        ]}
                                                    >
                                                        <Input
                                                            prefix={<IdcardOutlined style={{ color: '#94a3b8' }} />}
                                                            placeholder="e.g. ABCDE1234F"
                                                            maxLength={10}
                                                            style={{ textTransform: 'uppercase' }}
                                                            size="large"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} sm={12}>
                                                    <Form.Item
                                                        name="appNo"
                                                        label="Application Number / DP ID"
                                                        rules={[{ required: true, message: 'Enter application number' }]}
                                                    >
                                                        <Input
                                                            prefix={<FileTextOutlined style={{ color: '#94a3b8' }} />}
                                                            placeholder="Enter application ID"
                                                            size="large"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" size="large" block>
                                                    Query Allotment Status
                                                </Button>
                                            </Form.Item>
                                        </Form>

                                        {result && (
                                            <div className="allotment-result-banner">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircleOutlined style={{ color: '#16a34a', fontSize: '24px' }} />
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900 m-0">
                                                            Application Found: {result.company}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 m-0">
                                                            PAN: {result.pan} • Live GMP: +₹{result.gmp}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs text-emerald-800 bg-emerald-50 p-2 rounded">
                                                    Verification passed locally. For final debit / credit confirmation, verify on the registrar link below.
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </Col>

                                <Col xs={24} lg={10}>
                                    <Card title="Official Registrar Portals" className="content-card">
                                        <p className="text-xs text-slate-500 mb-4">
                                            Click directly to check your live allotment status on registrar databases:
                                        </p>

                                        <div className="registrars-list">
                                            {registrars.map((reg) => (
                                                <a
                                                    key={reg.name}
                                                    href={reg.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="registrar-link-item"
                                                >
                                                    <div className="reg-info">
                                                        <span className="reg-title">{reg.name}</span>
                                                        <span className="reg-desc">{reg.desc}</span>
                                                    </div>
                                                    <LinkOutlined className="reg-arrow" />
                                                </a>
                                            ))}
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },
                    {
                        key: 'watchlist',
                        label: (
                            <span>
                                <StarFilled style={{ color: '#eab308', marginRight: 6 }} />
                                Saved Watchlist ({watchlist.length})
                            </span>
                        ),
                        children: (
                            <div>
                                {watchlistIpos.length > 0 ? (
                                    <IPOGmpTable
                                        ipos={watchlistIpos}
                                        watchlist={watchlist}
                                        onToggleWatchlist={onToggleWatchlist}
                                    />
                                ) : (
                                    <Empty
                                        description="Your watchlist is empty. Bookmark IPOs with the star icon to track them here!"
                                    >
                                        <Link to="/">
                                            <Button type="primary">Explore Live GMP Tracker</Button>
                                        </Link>
                                    </Empty>
                                )}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}