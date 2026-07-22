import { NextResponse } from "next/server";

export const revalidate = 300;

function toUtcIsoFromDateOnlySP(dateStr: string, addDays = 0) {
  // Interpreta "YYYY-MM-DD" como meia-noite em America/Sao_Paulo (UTC-03)
  // e converte para ISO em UTC (00:00 -03:00 => 03:00Z).
  const [y, m, d] = dateStr.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + addDays, 3, 0, 0));
  return utc.toISOString();
}

function normalizeTimeParam(value: string, isEnd: boolean) {
  // Se já vier RFC3339/ISO com hora, usa como está
  if (value.includes("T")) return value;

  // Se vier só "YYYY-MM-DD":
  // timeMin = começo do dia (SP)
  // timeMax = começo do dia seguinte (SP), pois timeMax é exclusivo
  return toUtcIsoFromDateOnlySP(value, isEnd ? 1 : 0);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!calendarId || !apiKey) {
    return NextResponse.json({ items: [], unavailable: true }, { status: 200 });
  }

  const timeMin = normalizeTimeParam(start, false);
  const timeMax = normalizeTimeParam(end, true);

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events` +
    `?key=${encodeURIComponent(apiKey)}` +
    `&timeMin=${encodeURIComponent(timeMin)}` +
    `&timeMax=${encodeURIComponent(timeMax)}` +
    `&singleEvents=true` +
    `&orderBy=startTime` +
    `&timeZone=${encodeURIComponent("America/Sao_Paulo")}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      return NextResponse.json({ items: [], unavailable: true }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json({ ...data, unavailable: false }, { status: 200 });
  } catch {
    return NextResponse.json({ items: [], unavailable: true }, { status: 200 });
  }
}
