import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

const SITE_URL = 'https://ipogmp.in';
const API_URL = 'https://ipobackend.onrender.com/api/ipo/ipos';

// Static routes configuration
const STATIC_ROUTES = [
    {
        url: '/',
        changefreq: 'daily',
        priority: '1.0',
    },
    {
        url: '/live-gmp',
        changefreq: 'hourly',
        priority: '0.95',
    },
    {
        url: '/ipos',
        changefreq: 'daily',
        priority: '0.90',
    },
    {
        url: '/dashboard',
        changefreq: 'daily',
        priority: '0.80',
    },
    {
        url: '/about',
        changefreq: 'monthly',
        priority: '0.60',
    },
    {
        url: '/contact',
        changefreq: 'monthly',
        priority: '0.60',
    },
    {
        url: '/disclaimer',
        changefreq: 'monthly',
        priority: '0.50',
    },
    {
        url: '/privacy-policy',
        changefreq: 'monthly',
        priority: '0.50',
    },
];

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

async function fetchLiveIpos() {
    try {
        console.log(`📡 Fetching IPOs from ${API_URL}...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(API_URL, {
            headers: { 'Accept': 'application/json' },
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`API returned HTTP ${res.status}`);
        }

        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || json.ipos || []);
        console.log(`✅ Loaded ${list.length} IPO records from API.`);
        return list;
    } catch (err) {
        console.warn(`⚠️ Could not fetch live IPOs (${err.message}). Using fallback static routes.`);
        return [];
    }
}

function buildSitemapXml(ipos = []) {
    const today = new Date().toISOString().slice(0, 10);

    const urls = [];

    // 1. Static routes
    for (const r of STATIC_ROUTES) {
        urls.push(`    <url>
        <loc>${SITE_URL}${r.url}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${r.changefreq}</changefreq>
        <priority>${r.priority}</priority>
    </url>`);
    }

    // 2. Dynamic IPO Detail pages
    const seenSlugs = new Set();
    for (const ipo of ipos) {
        const slug = ipo.slug;
        if (!slug || seenSlugs.has(slug)) continue;
        seenSlugs.add(slug);

        const status = (ipo.status || '').toLowerCase();
        const isOpen = status.includes('open');
        const isUpcoming = status.includes('upcoming');
        const isClosed = status.includes('closed') || status.includes('listed');

        let priority = '0.80';
        let changefreq = 'daily';

        if (isOpen) {
            priority = '0.90';
            changefreq = 'hourly';
        } else if (isUpcoming) {
            priority = '0.85';
            changefreq = 'daily';
        } else if (isClosed) {
            priority = '0.70';
            changefreq = 'weekly';
        }

        const dateVal = ipo.listing_date || ipo.close_date || ipo.open_date || today;

        urls.push(`    <url>
        <loc>${SITE_URL}/ipos/${escapeXml(slug)}</loc>
        <lastmod>${dateVal.slice(0, 10)}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

function buildRobotsTxt() {
    return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/

# Host & Sitemap
Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function buildManifest() {
    return {
        short_name: 'IPOGMP',
        name: 'IPOGMP - Live IPO Grey Market Premium',
        description: 'Track live IPO Grey Market Premium (GMP), expected listing price, IPO subscription status, allotment dates, and financial analytics.',
        icons: [
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ],
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#056a42',
        background_color: '#ffffff',
        categories: ['finance', 'business', 'news']
    };
}

async function main() {
    console.log('🚀 [SEO Prebuild] Starting SEO generation for ipogmp.in...');

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // 1. Fetch live IPOs
    const ipos = await fetchLiveIpos();

    // 2. Generate sitemap.xml
    const sitemapContent = buildSitemapXml(ipos);
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
    console.log(`📄 Wrote ${sitemapPath} (Total ${STATIC_ROUTES.length + ipos.length} URLs indexed)`);

    // 3. Generate robots.txt
    const robotsContent = buildRobotsTxt();
    const robotsPath = path.join(publicDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
    console.log(`🤖 Wrote ${robotsPath}`);

    // 4. Update manifest.json
    const manifestContent = JSON.stringify(buildManifest(), null, 2);
    const manifestPath = path.join(publicDir, 'manifest.json');
    fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
    console.log(`📱 Wrote ${manifestPath}`);

    // 5. Clean up old CRA index.html in public/ if present so it doesn't collide
    const craIndexInPublic = path.join(publicDir, 'index.html');
    if (fs.existsSync(craIndexInPublic)) {
        fs.unlinkSync(craIndexInPublic);
        console.log(`🧹 Cleaned up legacy CRA index.html from public/`);
    }

    console.log('✨ [SEO Prebuild] Completed successfully!\n');
}

main().catch((err) => {
    console.error('❌ SEO Prebuild Error:', err);
    process.exit(1);
});

