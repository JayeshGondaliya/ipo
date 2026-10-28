import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    AlertTriangle, 
    ArrowLeft, 
    Scale, 
    ShieldAlert, 
    ExternalLink, 
    Mail 
} from 'lucide-react';

export default function Disclaimer() {
    useEffect(() => {
        document.title = 'Disclaimer · IPOGMP & ipoguru.in';
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
                    <span className="text-slate-800 font-medium">Disclaimer</span>
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3 tracking-wide uppercase">
                    <ShieldAlert size={13} />
                    Important Legal Notice & Risk Disclosure
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Disclaimer
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                    Last updated: October 2026 &nbsp;·&nbsp; Applicable to all visitors and users of <strong>ipogmp.in</strong>
                </p>
                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                    Please read this disclaimer carefully before using this website or relying on any information, Grey Market Premiums (GMP), subscription figures, or IPO schedules published herein.
                </p>
            </div>

            {/* Direct Render UI Content Flow (Clean, authentic, professional) */}
            <div className="space-y-8 pt-2">
                {/* Section 1: Informational Nature */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#056a42] rounded-full inline-block"></span>
                        1. For Informational and Educational Purposes Only
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        All information published on <strong>ipogmp.in</strong> — including IPO Grey Market Premiums (GMP), Kostak rates, Subject to Sauda terms, price bands, issue dates, and estimated listing prices — is compiled strictly for news reporting, historical tracking, and general educational reference.
                    </p>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        Nothing contained on this website constitutes, or should be construed as, investment advice, financial planning, a stock recommendation, an offer to buy or sell securities, or an endorsement of any initial public offering.
                    </p>
                </section>

                {/* Section 2: SEBI Regulatory Status */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#056a42] rounded-full inline-block"></span>
                        2. No SEBI Registration & Independent Status
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        <strong>ipogmp.in</strong> is an independent digital media and financial data tracking platform. We are <strong>not</strong> registered with the Securities and Exchange Board of India (SEBI) as:
                    </p>
                    <ul className="space-y-1.5 text-slate-700 text-sm sm:text-[14.5px] list-disc list-inside pl-1">
                        <li>An Investment Adviser (RIA) under the SEBI (Investment Advisers) Regulations, 2013;</li>
                        <li>A Research Analyst (RA) under the SEBI (Research Analysts) Regulations, 2014;</li>
                        <li>A Stock Broker, Sub-broker, Merchant Banker, or Portfolio Manager.</li>
                    </ul>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        We do not provide personalized portfolio advice, manage capital, accept deposits, or trade on behalf of users.
                    </p>
                </section>

                {/* Section 3: Grey Market Nature & Risks */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-amber-600 rounded-full inline-block"></span>
                        3. Nature of Grey Market Premium (GMP) and Market Risks
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        The "Grey Market" is an informal, unofficial, and unregulated over-the-counter (OTC) dealing mechanism. It operates outside the jurisdiction and supervision of SEBI, the National Stock Exchange of India (NSE), and the Bombay Stock Exchange (BSE).
                    </p>
                    <ul className="space-y-2 text-slate-700 text-sm sm:text-[14.5px]">
                        <li>
                            <strong>Data Sourcing & Partnership:</strong> IPO GMP data published on this website is provided in technical partnership with <a href="https://www.ipoguru.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-green hover:underline">ipoguru.in</a> and compiled from regional over-the-counter dealers.
                        </li>
                        <li>
                            <strong>Volatility & Speculation:</strong> Grey market prices are subject to extreme market volatility, low dealer liquidity, speculative spikes, and sudden reversals.
                        </li>
                        <li>
                            <strong>No Listing Guarantee:</strong> A high, moderate, or low GMP does <em>not</em> guarantee the actual debut listing price on stock exchanges. Stock market conditions, institutional anchor allocations, overall liquidity, and macroeconomic news can dramatically alter exchange debut valuations.
                        </li>
                    </ul>
                </section>

                {/* Section 4: Requirement for Due Diligence */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#056a42] rounded-full inline-block"></span>
                        4. Due Diligence and Official Prospectus (RHP)
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        Investors considering applying for any Mainboard or SME public issue should base their investment choices solely on:
                    </p>
                    <ul className="space-y-1.5 text-slate-700 text-sm sm:text-[14.5px] list-disc list-inside pl-1">
                        <li>The official <strong>Red Herring Prospectus (RHP)</strong> or <strong>Draft Red Herring Prospectus (DRHP)</strong> filed by the issuer with SEBI and the stock exchanges;</li>
                        <li>The issuer's audited financial statements, risk factors, promoter background, and objects of the issue;</li>
                        <li>Independent consultation with a certified, SEBI-registered financial planner or investment adviser.</li>
                    </ul>
                </section>

                {/* Section 5: Limitation of Liability */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#056a42] rounded-full inline-block"></span>
                        5. Accuracy and Limitation of Liability
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        While we make every reasonable effort to ensure data timeliness and accuracy in coordination with our data partner <a href="https://www.ipoguru.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-green hover:underline">ipoguru.in</a>, we do not warrant or guarantee that the information, calculations, dates, or dealer quotes on this website are 100% error-free, uninterrupted, or current at every second.
                    </p>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        <strong>ipogmp.in</strong>, its operators, researchers, and technical partners shall not be held liable for any financial losses, trading losses, lost profits, or damages arising directly or indirectly from the use of, or inability to use, the information provided on this website.
                    </p>
                </section>

                {/* Section 6: Third-Party Links */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#056a42] rounded-full inline-block"></span>
                        6. Third-Party Links and Official Registrars
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        This site provides outbound links to external third-party services, such as official stock exchanges (NSE, BSE), the market regulator (SEBI), and official IPO registrars (Link Intime, KFin Technologies, Bigshare Services). These links are provided solely as a reference convenience. We do not endorse, control, or take responsibility for the content, privacy practices, or accuracy of any external website.
                    </p>
                </section>

                {/* Section 7: Inquiries */}
                <section className="pt-6 border-t border-slate-200 space-y-2.5">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Mail size={16} className="text-primary-green" />
                        Questions or Editorial Clarifications
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        If you have questions about this disclaimer or wish to report a quote discrepancy, please contact our desk at:
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

