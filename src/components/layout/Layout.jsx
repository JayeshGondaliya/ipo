import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout({ children, watchlistCount = 0 }) {
    return (
        <div className="app-shell">
            <Navbar watchlistCount={watchlistCount} />
            <main className="page-wrap">{children}</main>
            <Footer />
        </div>
    );
}