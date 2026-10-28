export default function IPOSeoContent() {
    return (
        <section className="mt-12 space-y-10 text-slate-800" aria-label="IPO Grey Market Information & Guide">

            {/* Section 1: Overview */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-2 border-b border-slate-200 mb-4">
                    What is IPO Grey Market Premium (GMP)?
                </h2>
                <div className="space-y-3 text-[14.5px] leading-relaxed text-slate-700">
                    <p>
                        The <strong>IPO Grey Market Premium (GMP)</strong> is the unofficial price at which shares of an upcoming Initial Public Offering (IPO) are traded among market dealers and investors before they are officially listed on the National Stock Exchange (NSE) or Bombay Stock Exchange (BSE).
                    </p>
                    <p>
                        The grey market operates as an over-the-counter (OTC) cash market. When an IPO receives strong demand from institutional, high-net-worth (HNI), and retail investors, its grey market premium tends to rise. Conversely, if a public issue is overpriced or overall market sentiment is weak, the GMP can decline or even trade at a discount.
                    </p>
                </div>
            </div>

            {/* Section 2: Calculation */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-2 border-b border-slate-200 mb-4">
                    How is Estimated IPO Listing Price Calculated?
                </h2>
                <div className="space-y-3 text-[14.5px] leading-relaxed text-slate-700">
                    <p>
                        The estimated listing price indicates where an IPO might open on its first day of trading based on the prevailing grey market sentiment. It is calculated using a straightforward formula:
                    </p>
                    <div className="my-3 py-2.5 px-4 bg-slate-50 border-l-4 border-[#056a42] text-slate-800 text-sm font-medium space-y-1">
                        <div><strong>Estimated Listing Price</strong> = Issue Price (Upper Band) + Current GMP</div>
                        <div><strong>Estimated Listing Gain (%)</strong> = (Current GMP ÷ Issue Price) × 100</div>
                    </div>
                    <p>
                        <em>Example:</em> If a company sets its IPO price band with an upper cap of <strong>₹500</strong> per share and the current GMP is trading at <strong>₹100</strong>, the expected listing price is <strong>₹600</strong> (an estimated gain of <strong>+20.00%</strong>).
                    </p>
                </div>
            </div>

            {/* Section 3: Terminology */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-2 border-b border-slate-200 mb-4">
                    Key Terms in IPO Grey Market: GMP, Kostak & Subject to Sauda
                </h2>
                <div className="space-y-4 text-[14.5px] leading-relaxed text-slate-700">
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900 mb-1">
                            1. Grey Market Premium (GMP)
                        </h3>
                        <p>
                            The per-share premium that buyers are willing to pay over the IPO issue price. If you get allotment and sell on listing day, the GMP gives an early indication of your potential listing day return.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900 mb-1">
                            2. Kostak Rate
                        </h3>
                        <p>
                            Kostak is the fixed profit amount an investor earns by selling their entire IPO application to a buyer before the allotment is declared. The investor receives the agreed Kostak amount regardless of whether they are allotted any shares.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900 mb-1">
                            3. Subject to Sauda (Base Sauda)
                        </h3>
                        <p>
                            In a 'Subject to Sauda' deal, the transaction is valid only if the applicant is allotted shares in the IPO. If the applicant gets the allotment, they earn the agreed profit. If no shares are allotted, the deal is automatically cancelled.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 4: What Drives GMP */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-2 border-b border-slate-200 mb-4">
                    Factors That Influence IPO GMP Trends
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-[14px] leading-relaxed text-slate-700">
                    <li>
                        <strong>Qualified Institutional Buyers (QIB) Bidding:</strong> Demand from mutual funds, banks, and foreign institutional investors (FIIs) on the final day of bidding is the strongest catalyst for GMP movements.
                    </li>
                    <li>
                        <strong>Company Fundamentals & Valuation:</strong> Issues priced attractively compared to their listed industry peers typically see sustained grey market premiums.
                    </li>
                    <li>
                        <strong>Anchor Book Allocation:</strong> High-quality sovereign wealth funds and tier-1 domestic asset managers backing the anchor investor list boost investor confidence.
                    </li>
                    <li>
                        <strong>Secondary Market Sentiment:</strong> Broader market trends in the Nifty 50 and BSE Sensex directly impact IPO appetite; weak secondary markets often dampen grey market premiums.
                    </li>
                </ul>
            </div>

            {/* Section 5: Direct Rendered FAQs */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-2 border-b border-slate-200 mb-4">
                    Frequently Asked Questions (FAQs)
                </h2>
                <div className="space-y-5 text-[14.5px] leading-relaxed">
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900 mb-1">
                            Is IPO Grey Market trading legal and approved by SEBI?
                        </h3>
                        <p className="text-slate-700">
                            No. The grey market is an unofficial, informal over-the-counter market that is neither regulated nor endorsed by the Securities and Exchange Board of India (SEBI) or the stock exchanges (NSE/BSE). There are no official contracts, and trades are carried out on personal trust.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900 mb-1">
                            Does a high GMP guarantee listing day profits?
                        </h3>
                        <p className="text-slate-700">
                            No. While a high GMP indicates positive market sentiment, it does not guarantee listing gains. Sudden market volatility, geopolitical developments, or opening-day selling pressure can alter the actual listing price.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900 mb-1">
                            What is the difference between Mainboard and SME IPOs?
                        </h3>
                        <p className="text-slate-700">
                            Mainboard IPOs are launched by larger corporations on the main NSE/BSE boards with retail application sizes around ₹14,000–₹15,000. SME IPOs are listed on dedicated SME exchanges (NSE Emerge and BSE SME) and require larger application amounts, typically between ₹1,00,000 and ₹1,40,000.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900 mb-1">
                            How frequently is the GMP updated on IPOGMP?
                        </h3>
                        <p className="text-slate-700">
                            GMP numbers on IPOGMP are tracked throughout daily market trading hours from active market dealer networks and updated in real time as rates fluctuate.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 6: Editorial Disclaimer */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
                <p className="m-0">
                    <strong>Disclaimer:</strong> All IPO Grey Market Premium (GMP), Kostak rates, and estimated listing values provided on this page are gathered from market circles for informational and educational purposes only. The grey market is unregulated. Never make investment decisions based solely on GMP figures. Always read the company's official Red Herring Prospectus (RHP) and consult a SEBI-registered investment advisor before applying for an IPO.
                </p>
            </div>

        </section>
    );
}
