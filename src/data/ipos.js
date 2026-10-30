// Dynamic months generator based on current calendar date
export function generateCalendarMonths(activeList = []) {
    const buckets = new Set();
    const now = new Date();
    
    // Always include current month and past 6 months
    for (let i = 0; i < 7; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        buckets.add(`${y}-${m}`);
    }

    // Add any dates from current API items
    activeList.forEach((ipo) => {
        const d = ipo.openDate || ipo.closeDate || ipo.listingDate;
        if (d && d.length >= 7) {
            buckets.add(d.slice(0, 7));
        }
    });

    return Array.from(buckets).sort().reverse();
}

export const latestCalendarMonth = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()).slice(0, 7);
export const calendarMonthsList = generateCalendarMonths();
