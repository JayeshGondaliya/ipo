export default function Button({ children, onClick, type = 'button' }) {
    return (
        <button
            className="rounded-sm bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
}