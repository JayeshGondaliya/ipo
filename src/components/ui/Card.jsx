export default function Card({ children, className = '' }) {
    return <section className={`border border-white/10 bg-white/[0.03] ${className}`}>{children}</section>;
}