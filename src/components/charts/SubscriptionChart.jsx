import ProgressBar from '../ui/ProgressBar.jsx';
import { formatSubscription } from '../../utils/format.js';

export default function SubscriptionChart({ value = 0, max = 10 }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subscription</span>
                <span className="font-medium text-white">{formatSubscription(value)}</span>
            </div>
            <ProgressBar value={value} max={max} />
        </div>
    );
}