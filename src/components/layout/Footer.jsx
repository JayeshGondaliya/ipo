import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink } from 'lucide-react';

const currentYear = new Date().getFullYear();

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

export default function Footer() {
    return (
        <footer className="footer-root">
            {/* Main Footer Body */}
            <div className="footer-body">
                <div className="footer-grid">

                    {/* Brand Column */}
                    <div className="footer-col footer-col--brand">
                        <Link to="/" aria-label="IPOGMP Home" className="footer-logo-link">
                            <img src="/logo.png" alt="IPOGMP" className="footer-logo-img" />
                        </Link>
                        <p className="footer-tagline">
                            India's live IPO Grey Market Premium (GMP) tracker. Real-time data, subscription status, allotment checks, and listing analytics — all in one place.
                        </p>
                        <p className="footer-sub-note">
                            GMP data is compiled from grey market dealers for informational reference.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-col-heading">Quick Links</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/">Live GMP Tracker</Link></li>
                            <li><Link to="/ipos">IPO Calendar</Link></li>
                            <li><Link to="/dashboard">Check Allotment</Link></li>
                        </ul>
                    </div>

                    {/* IPO Resources */}
                    <div className="footer-col">
                        <h4 className="footer-col-heading">IPO Resources</h4>
                        <ul className="footer-link-list">
                            <li>
                                <a href="https://www.sebi.gov.in" target="_blank" rel="noreferrer">
                                    SEBI Official <ExternalLink size={11} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.nseindia.com" target="_blank" rel="noreferrer">
                                    NSE India <ExternalLink size={11} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.bseindia.com" target="_blank" rel="noreferrer">
                                    BSE India <ExternalLink size={11} />
                                </a>
                            </li>
                            <li>
                                <a href="https://linkintime.co.in" target="_blank" rel="noreferrer">
                                    Link Intime Registrar <ExternalLink size={11} />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Stay Updated */}
                    <div className="footer-col">
                        <h4 className="footer-col-heading">Stay Updated</h4>
                        <p className="footer-update-text">
                            Get live GMP alerts and IPO updates directly on WhatsApp or Telegram.
                        </p>
                        <div className="footer-social-links">
                            <a
                                href="https://chat.whatsapp.com"
                                target="_blank"
                                rel="noreferrer"
                                className="footer-social-btn footer-social-btn--wa"
                                aria-label="Join on WhatsApp"
                            >
                                <WhatsAppIcon size={16} /> WhatsApp
                            </a>
                            <a
                                href="https://t.me"
                                target="_blank"
                                rel="noreferrer"
                                className="footer-social-btn footer-social-btn--tg"
                                aria-label="Join on Telegram"
                            >
                                <TelegramIcon size={16} /> Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-inner">
                    <p className="footer-copyright">
                        © {currentYear} ipogmmp.in &nbsp;·&nbsp; All rights reserved &nbsp;·&nbsp; For informational purposes only
                    </p>
                    <p className="footer-disclaimer">
                        <ShieldCheck size={12} aria-hidden="true" />
                        GMP is an unregulated grey market indicator. Not investment advice. Consult a SEBI-registered advisor before investing.
                    </p>
                </div>
            </div>
        </footer>
    );
}