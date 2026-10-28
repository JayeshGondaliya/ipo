import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Building2, 
    ShieldCheck, 
    TrendingUp, 
    Scale, 
    FileText, 
    Mail, 
    Clock, 
    Search, 
    CheckCircle2, 
    ArrowRight,
    ArrowLeft,
    Layers,
    BadgeCheck
} from 'lucide-react';

function WhatsAppIcon({ size = 16, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.42.06-.64.3-.22.25-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.29s-1.44-.71-1.66-.79c-.22-.08-.39-.12-.55.12-.16.25-.63.79-.77.96-.14.16-.29.18-.54.06s-1.05-.39-2-1.23c-.74-.66-1.24-1.48-1.38-1.73-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43s.16-.25.25-.41c.08-.17.04-.31-.02-.43s-.55-1.33-.76-1.82c-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.47-.01" />
        </svg>
    );
}

function TelegramIcon({ size = 16, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.693c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
        </svg>
    );
}

export default function About() {
    useEffect(() => {
        document.title = 'About Us · IPOGMP | Independent Indian IPO & GMP Intelligence';
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
                    <span className="text-slate-800 font-medium">About Us</span>
                </nav>
                <Link
                    to="/"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-green hover:underline"
                >
                    <ArrowLeft size={13} />
                    Back to Live GMP Tracker
                </Link>
            </div>

            {/* Page Header Banner */}
            <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-[#056a42] border border-emerald-200/80 mb-3 tracking-wide uppercase">
                    <Building2 size={13} />
                    Independent Indian IPO Research Desk
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    About IPOGMP
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                    Dedicated to bringing transparent, verified, and timely market intelligence to Indian retail investors tracking Mainboard and SME Initial Public Offerings.
                </p>
            </div>

            {/* Top Cards - Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 text-center sm:text-left shadow-xs">
                    <div className="w-8 h-8 rounded-md bg-emerald-50 text-primary-green flex items-center justify-center mb-2 mx-auto sm:mx-0">
                        <TrendingUp size={18} />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900">Live GMP</div>
                    <div className="text-xs text-slate-500 mt-0.5">Dealer-compiled grey market quotes</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 text-center sm:text-left shadow-xs">
                    <div className="w-8 h-8 rounded-md bg-blue-50 text-[#136aa6] flex items-center justify-center mb-2 mx-auto sm:mx-0">
                        <Layers size={18} />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900">BSE & NSE</div>
                    <div className="text-xs text-slate-500 mt-0.5">Mainboard + SME Emerge issues</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 text-center sm:text-left shadow-xs">
                    <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                        <Clock size={18} />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900">Twice-Daily</div>
                    <div className="text-xs text-slate-500 mt-0.5">Morning & evening rate refreshes</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 text-center sm:text-left shadow-xs">
                    <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                        <ShieldCheck size={18} />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900">100% Free</div>
                    <div className="text-xs text-slate-500 mt-0.5">Public retail investor reference</div>
                </div>
            </div>

            {/* Direct Render UI Content Flow */}
            <div className="space-y-8 pt-2">
                {/* Section 1: Who We Are & Why We Started */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary-green rounded-full inline-block"></span>
                        Our Purpose & Mission
                    </h2>
                    <div className="text-slate-700 text-sm sm:text-[15px] leading-relaxed space-y-3">
                        <p>
                            India’s primary capital market has experienced unprecedented growth over the last decade, with hundreds of high-growth companies raising capital across the BSE, NSE, and SME exchanges. As retail participation expanded from metropolitan hubs into tier-2 and tier-3 cities, the demand for timely, credible IPO data surged.
                        </p>
                        <p>
                            Historically, grey market estimates circulated informally through fragmented WhatsApp groups, local market brokers, and unverified forums. Retail applicants frequently encountered contradictory premiums, outdated numbers, and misleading figures.
                        </p>
                        <p>
                            <strong>IPOGMP</strong> was established with a singular objective: <strong>to bring clean, structured transparency to Indian IPO Grey Market tracking.</strong> In technical collaboration with our market data partner <strong>IPO Gurus</strong>, we aggregate regional dealer quotes, standardize listing expectation metrics, and present official issue dates, price bands, and allotment resources in a fast, mobile-friendly interface.
                        </p>
                    </div>
                </section>

                {/* Section 2: How GMP is Compiled & Calculated */}
                <section className="space-y-4 pt-6 border-t border-slate-200">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary-green rounded-full inline-block"></span>
                        How Grey Market Premium (GMP) Works & How We Track It
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
                        The <strong>Grey Market Premium (GMP)</strong> is an unofficial, over-the-counter (OTC) financial metric indicating the price difference between an IPO’s issue price band and the price at which shares or application rights trade among informal dealers before the company lists on stock exchanges.
                    </p>

                    {/* Standardized Mathematical Formulas */}
                    <div className="py-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2.5">
                            <Scale size={14} className="text-primary-green" />
                            Standardized Calculation Formulas
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm font-mono text-slate-800">
                            <div className="p-3 rounded-lg border border-slate-200 bg-white">
                                <span className="block text-slate-500 font-sans text-[11px] uppercase font-semibold mb-1">
                                    Estimated Listing Price
                                </span>
                                <span className="font-bold text-primary-green">
                                    Issue Price (Cap) + Live GMP
                                </span>
                            </div>
                            <div className="p-3 rounded-lg border border-slate-200 bg-white">
                                <span className="block text-slate-500 font-sans text-[11px] uppercase font-semibold mb-1">
                                    Estimated Listing Gain (%)
                                </span>
                                <span className="font-bold text-primary-green">
                                    (Live GMP ÷ Issue Price) × 100
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2.5 text-slate-700 text-sm sm:text-[14.5px]">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                            Our Verification & Data Aggregation Process:
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 size={16} className="text-primary-green shrink-0 mt-1" />
                                <span>
                                    <strong>Data Partnership with ipoguru.in:</strong> In technical collaboration with our primary market data partner <a href="https://www.ipoguru.in/" target="_blank" rel="noopener noreferrer" className="text-primary-green font-semibold hover:underline">ipoguru.in</a>, we syndicate verified dealer bids, grey market sentiment, and historical issue metrics.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 size={16} className="text-primary-green shrink-0 mt-1" />
                                <span>
                                    <strong>Direct Dealer Sourcing:</strong> Quotes are cross-verified with over-the-counter dealers operating across active hubs, including Mumbai, Rajkot, Ahmedabad, Surat, and Jaipur.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 size={16} className="text-primary-green shrink-0 mt-1" />
                                <span>
                                    <strong>Median Price Smoothing:</strong> Outlier bids and unsubstantiated speculative spikes are eliminated. We publish the prevailing median bid-ask spread to represent genuine market consensus.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 size={16} className="text-primary-green shrink-0 mt-1" />
                                <span>
                                    <strong>Timestamped Refreshes:</strong> Market rates are surveyed twice daily during trading cycles (morning session around 10:00 AM and closing session around 5:00 PM IST) to capture momentum shifts.
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Kostak vs Subject to Sauda Explanation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                                Kostak Rate
                            </h4>
                            <p className="text-xs text-slate-600 leading-normal">
                                The fixed compensation paid for purchasing an investor's entire IPO application rights before allotment. The buyer earns this regardless of whether shares are ultimately allotted.
                            </p>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                                Subject to Sauda (SS)
                            </h4>
                            <p className="text-xs text-slate-600 leading-normal">
                                A conditional agreement where premium is payable only if the IPO application successfully secures allotment on the registrar's official basis of allotment.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Editorial Standards */}
                <section className="space-y-4 pt-6 border-t border-slate-200">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary-green rounded-full inline-block"></span>
                        Our Core Editorial Standards
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-1.5">
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                                <BadgeCheck size={16} className="text-[#056a42]" />
                                Zero Commercial Broker Bias
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                We do not sell sponsored rankings, accept paid listing reviews, or promote speculative broker accounts. Every rating reflects quantitative GMP performance relative to issue price.
                            </p>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-1.5">
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                                <Search size={16} className="text-[#056a42]" />
                                Official Registrar Cross-Linking
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                We direct investors directly to official SEBI-registered registrars (Link Intime, KFintech, Bigshare, Cameo, Maashitla) for authoritative allotment verification.
                            </p>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-1.5">
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                                <FileText size={16} className="text-[#056a42]" />
                                Factual RHP Information
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Price bands, minimum lot quantities, retail quota limits, and anchor investor books are extracted directly from regulatory Red Herring Prospectuses (RHP).
                            </p>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-1.5">
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                                <Clock size={16} className="text-[#056a42]" />
                                Rapid Corrections Policy
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                If market dealer sentiment shifts rapidly or bids change after subscription closure, our research desk revises quoted rates promptly with verifiable timestamps.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 4: Regulatory Demarcation & SEBI Compliance */}
                <section className="space-y-3 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                        <ShieldCheck size={18} className="text-[#056a42]" />
                        Regulatory Demarcation & SEBI Compliance Advisory
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
                        <p>
                            <strong>IPOGMP is an independent market research and educational publishing portal.</strong> We are not a stock broker, portfolio manager, merchant banker, or SEBI-registered Investment Advisor (RIA) under the Securities and Exchange Board of India (Investment Advisers) Regulations, 2013.
                        </p>
                        <p>
                            The Grey Market is an informal, unofficial, and unregulated over-the-counter mechanism operating outside the auspices of SEBI, NSE, or BSE. Grey Market Premiums (GMP), Kostak rates, and Subject to Sauda terms are published solely for news reporting, historical research, and informational reference.
                        </p>
                        <p>
                            A positive or negative GMP does not guarantee actual stock exchange listing price or future performance. Market conditions, subscription patterns, and macro-economic factors can dramatically alter debut valuations. Investors should read the full Red Herring Prospectus (RHP) filed with SEBI and consult an independent, certified financial advisor before investing capital.
                        </p>
                    </div>
                </section>

                {/* Section 5: Contact Desk */}
                <section className="space-y-4 pt-6 border-t border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Mail size={18} className="text-primary-green" />
                            Contact the Editorial & Research Desk
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                            We welcome feedback from retail investors, financial analysts, and regional dealer desks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                            <div className="text-xs font-semibold uppercase text-slate-500 mb-1">
                                Editorial & General Inquiries
                            </div>
                            <a
                                href="mailto:contact@ipogmp.in"
                                className="text-sm font-bold text-primary-green hover:underline"
                            >
                                contact@ipogmp.in
                            </a>
                            <p className="text-xs text-slate-500 mt-1">
                                For site feedback, editorial inquiries, and platform questions.
                            </p>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                            <div className="text-xs font-semibold uppercase text-slate-500 mb-1">
                                Rate Corrections & Market Tip-Offs
                            </div>
                            <a
                                href="mailto:desk@ipogmp.in"
                                className="text-sm font-bold text-primary-green hover:underline"
                            >
                                desk@ipogmp.in
                            </a>
                            <p className="text-xs text-slate-500 mt-1">
                                Report regional dealer quote variations or upcoming issue disclosures.
                            </p>
                        </div>
                    </div>

                    {/* Community Channels */}
                    <div className="pt-1">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                            Official Live Alert Channels
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href="https://chat.whatsapp.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 border border-[#25D366]/30 text-xs font-semibold transition-colors"
                            >
                                <WhatsAppIcon size={16} />
                                Join Official WhatsApp Channel
                            </a>
                            <a
                                href="https://t.me"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#229ED9]/10 text-[#0b74a8] hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-xs font-semibold transition-colors"
                            >
                                <TelegramIcon size={16} />
                                Join Telegram Alerts
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
