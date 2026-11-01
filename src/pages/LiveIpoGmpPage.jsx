import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LiveIpoGmpView from '../components/ipo/LiveIpoGmpView.jsx';
import IPOSeoContent from '../components/common/IPOSeoContent.jsx';
import SEO from '../components/common/SEO.jsx';
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
            <SEO
                title="Live IPO GMP Today - Real-Time GMP of IPO &amp; Grey Market Rates"
                description="Live IPO GMP today table. Check real-time GMP of IPO, Kostak rates, Subject to Sauda, fire rating indicators, upcoming IPO GMP, and estimated listing prices."
                canonical="/live-gmp"
                keywords="live ipo gmp, ipo gmp today, gmp of ipo, gmp ipo, upcoming ipo gmp, real time gmp tracker, kostak rates"
            />
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
                    Live IPO GMP Today: Real-Time GMP of IPO
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Track <strong>live IPO GMP today</strong>, real-time <strong>GMP of IPO</strong> offerings, Kostak rates, Subject to Sauda, and subscription demand for current and <strong>upcoming IPO GMP</strong>.
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
