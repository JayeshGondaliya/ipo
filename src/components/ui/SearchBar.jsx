export default function SearchBar({ value, onChange, placeholder = 'Search companies' }) {
    return (
        <label className="block">
            <span className="sr-only">{placeholder}</span>
            <input
                className="w-full border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
                onChange={(event) => onChange?.(event.target.value)}
                placeholder={placeholder}
                type="search"
                value={value}
            />
        </label>
    );
}