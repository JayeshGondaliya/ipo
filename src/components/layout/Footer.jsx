import { AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-brand">
                <Link className="footer-logo" to="/" aria-label="IPOGMP Home">
                    <img src="/logo.png" alt="IPOGMP" style={{ height: '36px', objectFit: 'contain' }} />
                </Link>
                <p>Real-time IPO Grey Market Premium (GMP), subscription trackers & listing analytics.</p>
            </div>
            <nav className="footer-links" aria-label="Footer navigation">
                <Link to="/">Live GMP Tracker <ArrowUpRight aria-hidden="true" size={14} /></Link>
                <Link to="/ipos">IPO Calendar <ArrowUpRight aria-hidden="true" size={14} /></Link>
                <Link to="/dashboard">Check Allotment <ArrowUpRight aria-hidden="true" size={14} /></Link>
            </nav>
            <p className="footer-note">
                <AlertCircle aria-hidden="true" size={14} /> GMP is an unregulated grey market indicator and should be used for informational purposes only. Not investment advice.
            </p>
        </footer>
    );
}