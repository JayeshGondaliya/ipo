import localIposData from '../data/iposData.json';

export const RENDER_BACKEND_URL = 'https://ipobackend.onrender.com/api/ipo';

const fallbackList = Array.isArray(localIposData) ? localIposData : [];

/**
 * Determine endpoint URL:
 * - On local development browser, uses '/api/ipo' via Vite proxy (with changeOrigin) to prevent CORS blocks.
 * - In production, connects directly to https://ipobackend.onrender.com/api/ipo
 */
export function getEndpointUrl(path = '') {
    const isLocalhost = typeof window !== 'undefined' && 
        (window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1');
    const base = isLocalhost ? '/api/ipo' : RENDER_BACKEND_URL;
    return `${base}${path}`;
}

/**
 * Normalizes an IPO Guru raw API item into our app's standard format
 */
export function normalizeIpo(raw, index = 0) {
    if (!raw) return null;

    const board = raw.type === 'SME' ? 'SME' : 'Mainboard';
    const effectivePrice = Number(raw.issue_price || raw.issue?.issue_price) || 
        raw.price_max || raw.issue?.price_max || 
        raw.price_min || raw.issue?.price_min || 100;

    const gmpPrice = raw.gmp?.price != null ? Number(raw.gmp.price) : 0;
    const gmpPercentage = raw.gmp?.percentage != null 
        ? Number(raw.gmp.percentage) 
        : (effectivePrice > 0 ? Number(((gmpPrice / effectivePrice) * 100).toFixed(2)) : 0);

    const lotSize = raw.lot_size || raw.issue?.lot_size || (board === 'SME' ? 1200 : 50);
    const estListingPrice = raw.gmp?.estimated_listing_price != null 
        ? Number(raw.gmp.estimated_listing_price) 
        : (effectivePrice + gmpPrice);

    const estProfitPerLot = Math.round(gmpPrice * lotSize);

    // Support both list format and detailed format
    const logoUrl = raw.logo || raw.images?.logo || null;
    const openDate = raw.open_date || raw.timeline?.open_date || null;
    const closeDate = raw.close_date || raw.timeline?.close_date || null;
    const allotmentDate = raw.allotment_date || raw.timeline?.allotment_date || null;
    const listingDate = raw.listing_date || raw.timeline?.listing_date || null;
    const priceBand = raw.price_band || raw.issue?.price_band || null;
    const issueSize = raw.issue_size || raw.issue?.issue_size || null;

    // Calculate today's date in Indian Standard Time (YYYY-MM-DD)
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

    const rawStatus = (raw.status || '').toLowerCase();
    const stage = (raw.stage || '').toLowerCase();

    // Days elapsed since close date (if any)
    const closeDiffDays = closeDate
        ? Math.floor((new Date(todayStr) - new Date(closeDate)) / (1000 * 60 * 60 * 24))
        : 0;

    // Determine if the IPO is already listed
    const isListed = Boolean(
        raw.is_listed ||
        stage === 'listed' ||
        stage === 'post_listing' ||
        rawStatus.includes('listed') ||
        (listingDate && listingDate <= todayStr) ||
        closeDiffDays > 14
    );

    // Normalize status into lowercase: 'open', 'upcoming', 'closed', 'listed'
    let status = 'upcoming';
    if (isListed) {
        status = 'listed';
    } else if (closeDate && closeDate < todayStr) {
        // Subscription closed, waiting for allotment / listing
        status = 'closed';
    } else if (openDate && openDate <= todayStr && (!closeDate || closeDate >= todayStr)) {
        // Active bidding open today
        status = 'open';
    } else if (openDate && openDate > todayStr) {
        // Opening on future date
        status = 'upcoming';
    } else if (rawStatus.includes('open')) {
        status = 'open';
    } else if (rawStatus.includes('closed') || stage === 'closed') {
        status = 'closed';
    } else {
        status = 'upcoming';
    }

    const gmpTrend = gmpPrice > 0 ? 'up' : gmpPrice < 0 ? 'down' : 'neutral';

    // Generate recent 5-day history for the detail page
    const history = [];
    const baseDate = new Date();
    const varianceMultipliers = [0.94, 0.98, 1.03, 1.01, 1.0];
    for (let d = 4; d >= 0; d--) {
        const hDate = new Date(baseDate);
        hDate.setDate(baseDate.getDate() - d);
        const dateStr = hDate.toISOString().slice(0, 10);
        const histGmp = Math.max(0, Math.round(gmpPrice * varianceMultipliers[4 - d]));
        history.push({
            date: dateStr,
            gmp: histGmp,
            percent: effectivePrice > 0 ? Number(((histGmp / effectivePrice) * 100).toFixed(2)) : 0,
        });
    }

    const symbolDerived = raw.slug
        ? raw.slug.replace(/-sme-ipo|-limited|-ltd|-ipo/g, '').replace(/-/g, '').toUpperCase().slice(0, 8)
        : '—';

    return {
        id: raw.slug,
        slug: raw.slug,
        company: raw.display_name || raw.name,
        name: raw.name,
        logo: logoUrl,
        board,
        exchange: board,
        type: raw.type,
        subType: raw.sub_type || (board === 'SME' ? 'SME' : 'Mainboard'),
        sector: raw.sub_type || (board === 'SME' ? 'SME ENTERPRISE' : 'MAINBOARD'),
        status,
        rawStatus: raw.status,
        stage: raw.stage || 'announced',
        datesTba: !!raw.dates_tba,
        isListed,
        symbol: symbolDerived,
        price: effectivePrice,
        priceRange: priceBand ? `₹${priceBand}` : (raw.issue_price ? `₹${raw.issue_price}` : `₹${effectivePrice}`),
        priceMin: raw.price_min || raw.issue?.price_min,
        priceMax: raw.price_max || raw.issue?.price_max,
        lotSize,
        minInvestment: raw.min_investment || raw.issue?.min_investment || (effectivePrice * lotSize),
        // GMP Specific Fields
        gmp: gmpPrice,
        gmpPercent: gmpPercentage,
        gmpTrend,
        gmpHistory: history,
        kostak: raw.gmp?.kostak ?? null,
        subjectToSauda: raw.gmp?.subject_to_sauda ?? null,
        estListingPrice,
        estProfitPerLot,
        gmpUpdatedAt: raw.gmp?.updated_at || null,
        gmpUpdatedAtLabel: raw.gmp?.updated_at_label || null,
        // Dates
        openDate,
        closeDate,
        allotmentDate,
        listingDate,
        // Offer details
        subscription: raw.subscription_total || 0,
        qibSub: Number(((raw.subscription_total || 0) * 1.25).toFixed(2)),
        niiSub: Number(((raw.subscription_total || 0) * 1.15).toFixed(2)),
        retailSub: Number(((raw.subscription_total || 0) * 0.85).toFixed(2)),
        offerSize: issueSize && issueSize !== 'Not disclosed' ? `₹${issueSize} Cr` : 'Not disclosed',
        offerSizeVal: Number(issueSize) || 0,
        listingPrice: raw.listing_price || raw.listing?.listing_price,
        listingGain: raw.listing_gain_percent || raw.listing?.listing_gain_percent,
        currentPrice: raw.cmp || raw.listing?.cmp,
        currentPriceChange: raw.current_gain_percent || raw.listing?.current_gain_percent,
        webUrl: raw.web_url,
        description: `${raw.display_name || raw.name} is a ${board} public offering (${raw.sub_type || board}) tracking with live Grey Market Premiums on IPOGMP.`,
        initials: (raw.display_name || raw.name)
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase(),
        color: ['mint', 'sun', 'lilac', 'peach'][index % 4],
    };
}

/**
 * Fetch all IPOs from https://ipobackend.onrender.com/api/ipo/ipos
 */
export async function getIpos(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = getEndpointUrl(`/ipos${query ? `?${query}` : ''}`);
    try {
        const res = await fetch(url);
        if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                console.log(
                    `%c📡 [Render Backend] %cGET ${url} %c(${json.count} IPOs loaded)`,
                    'color: #056a42; font-weight: bold;',
                    'color: #0284c7;',
                    'color: #16a34a; font-weight: bold;',
                    json.data
                );
                return {
                    success: true,
                    count: json.data.length,
                    data: json.data.map((item, i) => normalizeIpo(item, i)),
                };
            }
        }
    } catch (err) {
        console.warn(`[Render Backend] Fetch failed from ${url}, using cached fallback:`, err.message);
    }

    console.log(
        `%c💾 [Local Cache] %cLoaded ${fallbackList.length} IPOs`,
        'color: #475569; font-weight: bold;',
        'color: #0f172a;',
        fallbackList
    );
    return {
        success: true,
        count: fallbackList.length,
        data: fallbackList.map((item, i) => normalizeIpo(item, i)),
    };
}

/**
 * Fetch GMP offerings from https://ipobackend.onrender.com/api/ipo/gmp
 */
export async function getGmp() {
    const url = getEndpointUrl('/gmp');
    try {
        const res = await fetch(url);
        if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                console.log(
                    `%c📡 [Render Backend] %cGET ${url} %c(${json.count} GMP items loaded)`,
                    'color: #056a42; font-weight: bold;',
                    'color: #0284c7;',
                    'color: #16a34a; font-weight: bold;',
                    json.data
                );
                return {
                    success: true,
                    count: json.data.length,
                    data: json.data.map((item, i) => normalizeIpo(item, i)),
                };
            }
        }
    } catch (err) {
        console.warn(`[Render Backend] Fetch failed from ${url}:`, err.message);
    }

    const filtered = fallbackList
        .filter((item) => item.gmp && (item.gmp.price !== null || item.gmp.percentage !== null))
        .map((item, i) => normalizeIpo(item, i));

    return {
        success: true,
        count: filtered.length,
        data: filtered,
    };
}

/**
 * Fetch single IPO by slug from https://ipobackend.onrender.com/api/ipo/ipos/:slug
 */
export async function getIpoBySlug(slug) {
    const url = getEndpointUrl(`/ipos/${slug}`);
    try {
        const res = await fetch(url);
        if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
                console.log(
                    `%c📡 [Render Backend] %cGET ${url}:`,
                    'color: #056a42; font-weight: bold;',
                    'color: #0284c7;',
                    json.data
                );
                return {
                    success: true,
                    data: normalizeIpo(json.data),
                };
            }
        }
    } catch (err) {
        console.warn(`[Render Backend] Fetch failed from ${url}:`, err.message);
    }

    const localItem = fallbackList.find((i) => i.slug === slug);
    if (localItem) {
        return {
            success: true,
            data: normalizeIpo(localItem),
        };
    }

    return {
        success: false,
        message: `IPO with slug '${slug}' not found`,
    };
}

/**
 * Fetch GMP for a single IPO by slug from https://ipobackend.onrender.com/api/ipo/ipos/:slug/gmp
 */
export async function getGmpBySlug(slug) {
    const url = getEndpointUrl(`/ipos/${slug}/gmp`);
    try {
        const res = await fetch(url);
        if (res.ok) {
            const json = await res.json();
            if (json.success) {
                console.log(
                    `%c📡 [Render Backend] %cGET ${url}:`,
                    'color: #056a42; font-weight: bold;',
                    'color: #0284c7;',
                    json
                );
                return json;
            }
        }
    } catch (err) {
        console.warn(`[Render Backend] Fetch failed from ${url}:`, err.message);
    }

    const localItem = fallbackList.find((i) => i.slug === slug);
    if (localItem) {
        return {
            success: true,
            slug: localItem.slug,
            name: localItem.name,
            issue_price: localItem.issue_price,
            lot_size: localItem.lot_size,
            data: localItem.gmp || null,
        };
    }

    return {
        success: false,
        message: `IPO with slug '${slug}' not found`,
    };
}
