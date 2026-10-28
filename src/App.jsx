import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import IPODetail from './pages/IPODetail.jsx';
import IPOList from './pages/IPOList.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
    const [watchlist, setWatchlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('ipogmp-watchlist') ?? '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('ipogmp-watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    function toggleWatchlist(id) {
        setWatchlist((current) => current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id]);
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#056a42',
                    colorSuccess: '#16a34a',
                    colorWarning: '#d97706',
                    colorError: '#dc2626',
                    colorInfo: '#0284c7',
                    colorBgBase: '#ffffff',
                    colorTextBase: '#0f172a',
                    colorTextSecondary: '#64748b',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    borderRadius: 8,
                    wireframe: false,
                },
                components: {
                    Table: {
                        headerBg: '#056a42',
                        headerColor: '#ffffff',
                        headerSortActiveBg: '#045233',
                        headerSortHoverBg: '#045233',
                        rowHoverBg: '#f4fbf7',
                        borderColor: '#e2e8f0',
                    },
                    Card: {
                        headerBg: 'transparent',
                    },
                    Tag: {
                        borderRadiusSM: 6,
                    },
                    Button: {
                        borderRadius: 6,
                        controlHeight: 36,
                    },
                    Input: {
                        borderRadius: 6,
                        controlHeight: 36,
                    },
                },
            }}
        >
            <BrowserRouter>
                <Layout watchlistCount={watchlist.length}>
                    <Routes>
                        <Route path="/" element={<Home watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />} />
                        <Route path="/ipos" element={<IPOList watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />} />
                        <Route path="/ipos/:id" element={<IPODetail watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />} />
                        <Route path="/dashboard" element={<Dashboard watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
                <Analytics />
            </BrowserRouter>
        </ConfigProvider>
    );
}