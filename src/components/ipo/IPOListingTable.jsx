import IPOTableRow from './IPOTableRow.jsx';

export default function IPOListingTable({ ipos, watchlist = [], onToggleWatchlist }) {
    return (
        <div className="ipo-table-scroll" role="region" aria-label="IPO offerings table" tabIndex="0">
            <table className="ipo-listing-table">
                <thead>
                    <tr>
                        <th scope="col">Company</th>
                        <th scope="col">Status</th>
                        <th scope="col">Price range</th>
                        <th scope="col">Offer size</th>
                        <th scope="col">Key date</th>
                        <th scope="col">Interest</th>
                        <th scope="col"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {ipos.map((ipo) => (
                        <IPOTableRow
                            key={ipo.id}
                            ipo={ipo}
                            isSaved={watchlist.includes(ipo.id)}
                            onToggleWatchlist={onToggleWatchlist}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}