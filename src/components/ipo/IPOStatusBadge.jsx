import Badge from '../ui/Badge.jsx';

const statusStyles = {
    upcoming: 'border-sky-400/30 text-sky-300',
    open: 'border-emerald-400/30 text-emerald-300',
    closed: 'border-rose-300 bg-rose-50 text-rose-700',
};

export default function IPOStatusBadge({ status }) {
    return <Badge className={statusStyles[status] ?? ''}>{status}</Badge>;
}