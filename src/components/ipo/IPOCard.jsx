import { ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatShortDate(value) {
    if (!value) return 'Not disclosed';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

export default function IPOCard({ ipo, isSaved = false, onToggleWatchlist }) {
    return (
        <article className="ipo-card">
            <div className="ipo-card-top">
                <div className="company-lockup">
                    <span className={`company-mark ${ipo.color}`} aria-hidden="true">{ipo.initials}</span>
                    <div>
                        <h3 className="company-name">{ipo.company}</h3>
                        <div className="company-meta"><span className="ticker">{ipo.symbol}</span><span className="meta-dot" />{ipo.sector}</div>
                    </div>
                </div>
                <span className={`status-pill ${ipo.status}`}>{ipo.status}</span>
            </div>
            <div className="ipo-card-divider" />
            <div className="ipo-facts">
                <div><div className="fact-label">Price range</div><div className="fact-value">{ipo.priceRange}</div></div>
                <div><div className="fact-label">Offer size</div><div className="fact-value">{ipo.offerSize}</div></div>
                <div><div className="fact-label">{ipo.status === 'closed' ? 'Closed' : 'Opens'}</div><div className="fact-value">{formatShortDate(ipo.status === 'closed' ? ipo.closeDate : ipo.openDate)}</div></div>
            </div>
            <div className="ipo-card-bottom">
                <div className="subscription-info" title="Illustrative subscription interest">
                    <span className="mini-progress"><span style={{ width: `${Math.min((ipo.subscription / 10) * 100, 100)}%` }} /></span>
                    <span>{ipo.subscription ? `${ipo.subscription.toFixed(1)}× interest` : 'Not yet open'}</span>
                </div>
                <div className="card-actions">
                    <button
                        className={`icon-button${isSaved ? ' saved' : ''}`}
                        type="button"
                        onClick={() => onToggleWatchlist?.(ipo.id)}
                        aria-label={isSaved ? `Remove ${ipo.company} from watchlist` : `Add ${ipo.company} to watchlist`}
                        aria-pressed={isSaved}
                        title={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
                    ><Bookmark aria-hidden="true" /></button>
                    <Link className="details-link" to={`/ipos/${ipo.id}`}>Details <ArrowRight aria-hidden="true" /></Link>
                </div>
            </div>
        </article>
    );
}