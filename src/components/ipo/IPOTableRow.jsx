import { ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatShortDate(value) {
    if (!value) return 'Not disclosed';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

export default function IPOTableRow({ ipo, isSaved = false, onToggleWatchlist }) {
    const dateLabel = ipo.status === 'closed' ? 'Closed' : 'Opens';
    const dateValue = ipo.status === 'closed' ? ipo.closeDate : ipo.openDate;

    return (
        <tr className="ipo-table-row">
            <td className="ipo-table-company-cell">
                <Link className="ipo-table-company" to={`/ipos/${ipo.id}`}>
                    <span className={`company-mark ${ipo.color}`} aria-hidden="true">{ipo.initials}</span>
                    <span className="ipo-table-company-copy"><strong>{ipo.company}</strong><span>{ipo.symbol} <i /> {ipo.sector}</span></span>
                </Link>
            </td>
            <td><span className={`status-pill ${ipo.status}`}>{ipo.status}</span></td>
            <td className="ipo-table-value">{ipo.priceRange}</td>
            <td className="ipo-table-value">{ipo.offerSize}</td>
            <td className="ipo-table-date"><span>{dateLabel}</span>{formatShortDate(dateValue)}</td>
            <td>
                {ipo.subscription > 0
                    ? <span className="interest-value">{ipo.subscription.toFixed(1)}×</span>
                    : <span className="interest-muted">Not open</span>}
            </td>
            <td className="ipo-table-actions">
                <button
                    className={`icon-button${isSaved ? ' saved' : ''}`}
                    type="button"
                    onClick={() => onToggleWatchlist?.(ipo.id)}
                    aria-label={isSaved ? `Remove ${ipo.company} from watchlist` : `Add ${ipo.company} to watchlist`}
                    aria-pressed={isSaved}
                    title={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
                ><Bookmark aria-hidden="true" /></button>
                <Link className="details-link" to={`/ipos/${ipo.id}`} aria-label={`View ${ipo.company} details`}><span>Details</span><ArrowRight aria-hidden="true" /></Link>
            </td>
        </tr>
    );
}