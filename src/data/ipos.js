import rawIposData from './iposData.json';
import { normalizeIpo } from '../api/ipoApi.js';

const rawList = Array.isArray(rawIposData) ? rawIposData : [];

export const allIpos = rawList.map((item, index) => normalizeIpo(item, index));

const ipoById = new Map(allIpos.map((ipo) => [ipo.id, ipo]));

// Build monthly buckets dynamically from dates
const monthBuckets = {};
allIpos.forEach((ipo) => {
    const rawDate = ipo.openDate || ipo.closeDate || ipo.listingDate || '2026-10';
    const monthKey = rawDate.slice(0, 7);
    if (!monthBuckets[monthKey]) {
        monthBuckets[monthKey] = [];
    }
    monthBuckets[monthKey].push(ipo.id);
});

// Sort months descending (e.g. 2026-11, 2026-10, 2026-09, 2026-08, 2026-07)
export const calendarMonthsList = Object.keys(monthBuckets).sort().reverse();

const today = new Date().toISOString().slice(0, 7);
export const latestCalendarMonth = calendarMonthsList.includes(today) 
    ? today 
    : (calendarMonthsList.includes('2026-10') ? '2026-10' : calendarMonthsList[0]);

export function getIposForMonth(month) {
    const slugs = monthBuckets[month] || [];
    return slugs.map((slug) => ipoById.get(slug)).filter(Boolean);
}

// Current month/active list default
const ipos = allIpos.filter((item) => item.status === 'open' || item.status === 'upcoming').length > 0
    ? allIpos.filter((item) => item.status === 'open' || item.status === 'upcoming')
    : allIpos.slice(0, 20);

export default ipos;
