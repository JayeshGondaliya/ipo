import Card from './Card.jsx';

export default function StatCard({ label, value, detail }) {
    return (
        <Card className="p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
            {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
        </Card>
    );
}