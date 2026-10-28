import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    Lock, 
    Eye, 
    Database, 
    Mail, 
    ArrowLeft, 
    CheckCircle2, 
    ExternalLink
} from 'lucide-react';

export default function PrivacyPolicy() {
    useEffect(() => {
        document.title = 'Privacy Policy · IPOGMP & IPO Gurus';
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-14">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Link to="/" className="hover:text-primary-green hover:underline">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-slate-800 font-medium">Privacy Policy</span>
                </nav>
                <Link
                    to="/"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-green hover:underline"
                >
                    <ArrowLeft size={13} />
                    Back to Live GMP Tracker
                </Link>
            </div>

            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Privacy Policy
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                    Last updated: October 2026 &nbsp;·&nbsp; Official Policy for <strong>IPOGMP</strong> (in collaboration with data partner <strong>IPO Gurus</strong>)
                </p>
                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                    We believe in complete transparency. Our platform is built for open access, requiring no account creation, financial credentials, or invasive tracking to access live IPO Grey Market data.
                </p>
            </div>

            {/* Top Three Cards - Clean summary highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
                    <div className="w-8 h-8 rounded-md bg-emerald-50 text-primary-green flex items-center justify-center mb-2">
                        <Lock size={18} />
                    </div>
                    <div className="text-sm font-bold text-slate-900">No Account Required</div>
                    <div className="text-xs text-slate-500 mt-1">
                        Browse all Mainboard & SME GMP rates freely without signing up or sharing phone numbers.
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
                    <div className="w-8 h-8 rounded-md bg-blue-50 text-[#136aa6] flex items-center justify-center mb-2">
                        <Database size={18} />
                    </div>
                    <div className="text-sm font-bold text-slate-900">Data Partner: ipoguru.in</div>
                    <div className="text-xs text-slate-500 mt-1">
                        Market rates and dealer intelligence are syndicated cleanly without trading user data.
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
                    <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
                        <Eye size={18} />
                    </div>
                    <div className="text-sm font-bold text-slate-900">Local Client Storage</div>
                    <div className="text-xs text-slate-500 mt-1">
                        Your IPO Watchlist stays strictly in your own browser's local storage and is never uploaded.
                    </div>
                </div>
            </div>

            {/* Direct Render UI Content Flow (No boxed card wrappers) */}
            <div className="space-y-8 pt-2">
                {/* Section 1 */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary-green rounded-full inline-block"></span>
                        1. Information We Collect and Process
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        <strong>IPOGMP</strong> is strictly an open informational portal. We do not require visitors to register an account, connect a Demat account, or share personal financial records.
                    </p>
                    <ul className="space-y-2.5 pt-1 text-slate-700 text-sm sm:text-[14.5px]">
                        <li className="flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-primary-green shrink-0 mt-1" />
                            <span>
                                <strong>Watchlist Preferences:</strong> When you mark an IPO with a star, this preference is saved solely on your device via browser <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200">localStorage</code>. This data never touches our servers.
                            </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-primary-green shrink-0 mt-1" />
                            <span>
                                <strong>Voluntary Inquiries:</strong> If you contact our research desk via email (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200">contact@ipogmp.in</code> or <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200">desk@ipogmp.in</code>), we retain your message and address solely to respond to your inquiry or rate correction tip-off.
                            </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-primary-green shrink-0 mt-1" />
                            <span>
                                <strong>Technical Diagnostics:</strong> Standard web hosting logs collect anonymized, non-personally identifiable diagnostic metrics (such as browser type, operating system, and page latencies) to maintain platform uptime and speed.
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary-green rounded-full inline-block"></span>
                        2. Data Partnership with ipoguru.in
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        To maintain high accuracy, rapid dealer quote refreshes, and extensive coverage across BSE Mainboard and SME Emerge platforms, <strong>IPOGMP</strong> collaborates with <a href="https://www.ipoguru.in/" target="_blank" rel="noopener noreferrer" className="text-primary-green font-semibold hover:underline">ipoguru.in</a> as our official market data partner.
                    </p>
                    <ul className="space-y-2 text-slate-700 text-sm sm:text-[14.5px] list-disc list-inside pl-1">
                        <li>Our partnership with ipoguru.in covers financial data aggregation, IPO issue timelines, price bands, and dealer quote feeds only.</li>
                        <li>No personal user identity, browsing history, or visitor logs are sold, traded, or shared with ipoguru.in or any third-party marketing entities.</li>
                        <li>All data exchange between our systems is restricted purely to public market pricing intelligence and issue calendars.</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary-green rounded-full inline-block"></span>
                        3. Cookies and Local Storage
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        We use minimal, privacy-friendly client storage mechanisms:
                    </p>
                    <ul className="space-y-2 text-slate-700 text-sm sm:text-[14.5px]">
                        <li>
                            <strong>Functional Storage:</strong> Used to remember your view preference (Table view vs. Grid view) and saved watchlist items so your layout remains consistent across page refreshes.
                        </li>
                        <li>
                            <strong>Anonymous Metrics:</strong> Lightweight analytics to measure aggregated page views without tracking your identity across third-party websites.
                        </li>
                    </ul>
                    <p className="text-xs text-slate-500">
                        You can clear your local storage or cookies at any time via your browser settings without affecting your ability to view live GMP rates.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary-green rounded-full inline-block"></span>
                        4. External Links to Registrars & Exchanges
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        For user convenience, our platform provides direct links to third-party services:
                    </p>
                    <ul className="space-y-1.5 text-slate-700 text-sm sm:text-[14.5px] list-disc list-inside pl-1">
                        <li>Official IPO Registrars (Link Intime, KFintech, Bigshare Services, Skyline, Maashitla, Cameo) for official allotment verification.</li>
                        <li>Official Regulatory Portals (SEBI, NSE India, BSE India) for formal filings, circulars, and draft prospectuses.</li>
                    </ul>
                    <p className="text-xs text-slate-500">
                        Please note that once you navigate to these external websites, their respective privacy policies and terms of service govern your interaction.
                    </p>
                </section>

                {/* Section 5 */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary-green rounded-full inline-block"></span>
                        5. Data Security & Indian DPDP Act Compliance
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        We implement appropriate technical safeguards, including standard HTTPS/TLS encryption across all endpoints, ensuring that your connection to our servers is secure from interception.
                    </p>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        In adherence to India's <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, we observe strict data minimization principles. We do not collect, request, or retain personal identification numbers, PAN details, Aadhaar numbers, or bank account credentials under any circumstances.
                    </p>
                </section>

                {/* Section 6 - Direct Render Contact Desk */}
                <section className="pt-6 border-t border-slate-200 space-y-2.5">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Mail size={16} className="text-primary-green" />
                        Contact Our Privacy Desk
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        If you have any questions regarding this Privacy Policy, your rights, or data handling practices at IPOGMP and our data partner IPO Gurus, please write to us at:
                    </p>
                    <div className="pt-1">
                        <a
                            href="mailto:contact@ipogmp.in"
                            className="text-xs sm:text-sm font-semibold text-primary-green hover:underline inline-flex items-center gap-1.5"
                        >
                            <span>contact@ipogmp.in</span>
                            <ExternalLink size={12} />
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
