import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'IPOGMP';
const DEFAULT_SITE_URL = 'https://ipogmp.in';
const DEFAULT_OG_IMAGE = 'https://ipogmp.in/logo.png';
const DEFAULT_DESCRIPTION = 'Track live IPO GMP today, real-time GMP of IPO, upcoming IPO GMP rates, estimated listing price, subscription status, and allotment dates in India.';
const DEFAULT_KEYWORDS = 'ipo gmp, gmp of ipo, gmp ipo, ipo gmp today, live ipo gmp, upcoming ipo gmp, ipo listing price, sme ipo gmp, mainboard ipo gmp, ipo allotment';

export default function SEO({
    title,
    description = DEFAULT_DESCRIPTION,
    canonical,
    keywords = DEFAULT_KEYWORDS,
    ogType = 'website',
    ogImage = DEFAULT_OG_IMAGE,
    noindex = false,
    schema = null,
}) {
    const fullTitle = title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : `${SITE_NAME} - IPO GMP Today, Live IPO GMP & Upcoming IPO GMP Rates`;
    const fullCanonical = canonical ? (canonical.startsWith('http') ? canonical : `${DEFAULT_SITE_URL}${canonical}`) : DEFAULT_SITE_URL;

    return (
        <Helmet>
            {/* Standard HTML Title and Meta */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={fullCanonical} />

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            )}

            {/* OpenGraph / Facebook */}
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullCanonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (Schema.org JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}

