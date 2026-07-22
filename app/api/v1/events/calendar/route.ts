import { NextResponse } from 'next/server';
export const revalidate = 300;
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
        return NextResponse.json({ items: [] });
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!calendarId || !apiKey) {
        return NextResponse.json({ items: [], unavailable: true });
    }

    try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            calendarId
        )}/events?key=${encodeURIComponent(apiKey)}&timeMin=${encodeURIComponent(start)}&timeMax=${encodeURIComponent(end)}&singleEvents=true&orderBy=startTime`;

        const res = await fetch(url, { next: { revalidate: 300 } });

        if (!res.ok) {
            return NextResponse.json({ items: [], unavailable: true });
        }

        const data = await res.json();
        return NextResponse.json({ ...data, unavailable: false });
    } catch {
        return NextResponse.json({ items: [], unavailable: true });
    }
}

//Filtre por data via query: ?date=2026-03-15
