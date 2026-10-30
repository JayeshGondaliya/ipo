import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LiveIpoGmpView from '../components/ipo/LiveIpoGmpView.jsx';
import IPOSeoContent from '../components/common/IPOSeoContent.jsx';
import { getIpos } from '../api/ipoApi.js';

export default function LiveIpoGmpPage() {
    const [liveIpos, setLiveIpos] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="py-3 max-w-7xl mx-auto">
            {/* Breadcrumb row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="text-xs text-slate-500 font-medium">
                    <Link to="/" className="text-slate-500 hover:text-[#056a42]">Report List</Link>
                    <span className="mx-1.5 text-slate-400">&gt;</span>
                    <span className="text-emerald-700 font-semibold">Live IPO GMP</span>
                </div>

            </div>

            {/* Page Header */}
            <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight m-0">
                    Live IPO GMP
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Track real-time grey market premiums, Kostak rates, Subject to Sauda, and live subscription status for ongoing, upcoming, and recent IPOs.
                </p>
            </div>

            {/* Full Width Live GMP View without Sidebars */}
            <div className="space-y-6">
                <LiveIpoGmpView ipos={liveIpos} onRefresh={loadData} loading={loading} />

                {/* SEO Knowledge Base */}
                <IPOSeoContent />
            </div>
        </div>
    );
}
