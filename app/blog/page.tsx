import { PageHero } from "@/app/components/site-sections";
import BlogCard, { BlogPostData } from "@/app/components/BlogCard";
import { notFound } from "next/navigation";
import { fetchBackend, readBackendJson } from "@/lib/backend";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: BlogPostData[] = [];

  const { blogEnabled } = await getSiteSettings();
  if (!blogEnabled) notFound();

  try {
    const res = await fetchBackend("/api/v1/blog/posts", { cache: "no-store" });
    if (res.ok) {
      const data = await readBackendJson(res);
      posts = Array.isArray(data.data) ? data.data as BlogPostData[] : [];
    }
  } catch (err) {
    console.error("[BlogPage] Erro ao buscar posts:", err);
  }

  return (
    <div className="space-y-12 pt-28 pb-8 sm:space-y-16">
      <PageHero
        eyebrow="Blog DADG"
        title="Artigos e Novidades"
        description="Fique por dentro das últimas notícias, artigos acadêmicos e comunicados oficiais do Diretório Acadêmico."
        aside={
          <div className="glass-panel-strong surface-outline relative overflow-hidden rounded-[28px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] px-5 py-5 shadow-[0_24px_64px_rgba(4,26,49,0.14)] dark:border-white/12 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)]">
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(9,66,125,0.35)] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,143,214,0.14),transparent_42%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Conteúdo</p>
              <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Aprenda com nossa comunidade acadêmica.</p>
            </div>
          </div>
        }
      />

      <section className="page-shell">
        {posts.length === 0 ? (
          <div className="glass-panel-strong p-10 text-center rounded-2xl border border-white/90 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)]">
            <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhum artigo publicado ainda. Volte em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
