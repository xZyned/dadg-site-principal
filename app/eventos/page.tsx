import Link from "next/link";
import ScheduleClient from "@/app/components/ScheduleClient";
import { PageHero } from "@/app/components/site-sections";
import EventCard from "@/app/components/EventCard";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

interface BackendEvent {
  _id: string;
  eventName: string;
  eventDescription: string;
  eventBenefits?: string;
  eventType: string;
  registrationCount: number;
  maxParticipants: number;
  isPaid: boolean;
  price?: number;
  statusDetails: {
    status: "DRAFT" | "PUBLISHED_OPEN" | "PUBLISHED_CLOSED" | "CERTIFICATE_ONLY";
    registrationStartDate?: string;
    registrationEndDate?: string;
  };
}

export default async function EventosPage() {
  const currentDate = new Date();
  const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

  let events: BackendEvent[] = [];
  let userSubscribedEventIds = new Set<string>();

  // 1. Buscar eventos abertos do mês no backend
  try {
    const eventsRes = await fetch(
      `${BACKEND_URL}/api/v1/events/openForRegistration/${yearMonth}`,
      { cache: "no-store" }
    );
    if (eventsRes.ok) {
      const eventsData = await eventsRes.json();
      events = eventsData.data || [];
    }
  } catch (err) {
    console.error("[EventosPage] Erro ao buscar eventos do backend:", err);
  }

  // 2. Buscar inscrições do usuário logado
  const session = await auth0.getSession();
  if (session?.user && session.tokenSet?.accessToken) {
    try {
      const ownerId = session.user.sub.includes("|")
        ? session.user.sub.split("|")[1]
        : session.user.sub;
      const cookieStore = await cookies();
      const cookieString = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

      const subsRes = await fetch(
        `${BACKEND_URL}/api/v1/events/user/${ownerId}`,
        { headers: { Cookie: cookieString }, cache: "no-store" }
      );
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        const subs: Array<{ eventId: { _id: string } | string }> = subsData.data || [];
        subs.forEach((s) => {
          const id = typeof s.eventId === "object" ? s.eventId._id : s.eventId;
          userSubscribedEventIds.add(String(id));
        });
      }
    } catch (err) {
      console.error("[EventosPage] Erro ao buscar inscrições:", err);
    }
  }

  const serializedEvents = events.map((e) => ({
    _id: String(e._id),
    eventName: e.eventName,
    eventDescription: e.eventDescription,
    eventBenefits: e.eventBenefits,
    eventType: e.eventType,
    registrationCount: e.registrationCount,
    maxParticipants: e.maxParticipants,
    isOpen: e.statusDetails?.status === "PUBLISHED_OPEN",
    isPaid: e.isPaid,
    price: e.price,
  }));

  const isLoggedIn = !!session?.user;
  const userAccessToken = session?.tokenSet?.accessToken || null;

  return (
    <div className="space-y-12 pt-28 pb-8 sm:space-y-16">
      <PageHero
        eyebrow="Eventos e Inscrições"
        title="Eventos e Calendário Acadêmico"
        description="Inscreva-se em nossos eventos e consulte a programação diária e mensal do calendário acadêmico."
        actions={
          <div className="flex flex-wrap gap-4">
            <Link href="#eventos" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 shadow-md transition-all hover:scale-105">
              Ver Eventos Abertos
            </Link>
            <Link href="#calendario" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)] transition-all hover:scale-105">
              Ver Calendário
            </Link>
          </div>
        }
        aside={
          <div className="glass-panel-strong surface-outline relative overflow-hidden rounded-[28px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] px-5 py-5 shadow-[0_24px_64px_rgba(4,26,49,0.14)] dark:border-white/12 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)]">
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(9,66,125,0.35)] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,143,214,0.14),transparent_42%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Inscrições</p>
              <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Gerencie sua participação em eventos.</p>
            </div>
          </div>
        }
      />

      <section id="eventos" className="page-shell">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Inscrições Abertas</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Confira os eventos disponíveis e garanta sua vaga.</p>
        </div>
        {serializedEvents.length === 0 ? (
          <div className="glass-panel-strong p-10 text-center rounded-2xl border border-white/90 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)]">
            <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhum evento com inscrições abertas neste mês. Verifique em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serializedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isSubscribed={userSubscribedEventIds.has(event._id)}
                isLoggedIn={isLoggedIn}
                accessToken={userAccessToken}
              />
            ))}
          </div>
        )}
      </section>

      <section id="calendario" className="page-shell pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Agenda Mensal</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Acompanhe o cronograma completo de atividades.</p>
        </div>
        <ScheduleClient />
      </section>
    </div>
  );
}
