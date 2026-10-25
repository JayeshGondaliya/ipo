/**
 * Utility functions for IPO GMP (Grey Market Premium) computations and formatting.
 */

export function formatINR(val, includeSymbol = true) {
    if (val == null || isNaN(val)) return '—';
    const num = Number(val);
    const prefix = includeSymbol ? '₹' : '';
    if (Math.abs(num) >= 10000000) {
        return `${prefix}${(num / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(num) >= 100000) {
        return `${prefix}${(num / 100000).toFixed(2)} L`;
    }
    return `${prefix}${num.toLocaleString('en-IN')}`;
}

export function formatPercentage(val) {
    if (val == null || isNaN(val)) return '—';
    const num = Number(val);
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
}

export function getGMPTrendInfo(trend) {
    switch (trend) {
        case 'up':
            return { color: '#16a34a', label: 'Surging', bg: '#ecfdf5' };
        case 'down':
            return { color: '#dc2626', label: 'Dropping', bg: '#fef2f2' };
        default:
            return { color: '#475569', label: 'Stable', bg: '#f1f5f9' };
    }
}

export function calculateLotMetrics(price, gmp, lotSize, lotsCount = 1) {
    const validPrice = Number(price) || 0;
    const validGmp = Number(gmp) || 0;
    const validLot = Number(lotSize) || 1;
    const count = Math.max(1, Number(lotsCount) || 1);

    const totalShares = validLot * count;
    const investment = validPrice * totalShares;
    const totalProfit = validGmp * totalShares;
    const estListingPrice = validPrice + validGmp;
    const gainPct = validPrice > 0 ? (validGmp / validPrice) * 100 : 0;

    return {
        totalShares,
        investment,
        totalProfit,
        estListingPrice,
        gainPct,
    };
}
