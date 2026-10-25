export default function ProgressBar({ value = 0, max = 100 }) {
    const progress = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className="h-1.5 overflow-hidden bg-white/10" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max}>
            <div className="h-full bg-emerald-400" style={{ width: `${progress}%` }} />
        </div>
    );
}