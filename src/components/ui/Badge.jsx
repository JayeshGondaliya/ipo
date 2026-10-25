export default function Badge({ children, className = '' }) {
    return (
        <span className={`inline-flex rounded-sm border border-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 ${className}`}>
            {children}
        </span>
    );
}