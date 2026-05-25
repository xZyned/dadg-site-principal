import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import BlogCommentSection from "@/app/components/BlogCommentSection";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/blog/posts/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      post = data.data;
    }
  } catch (err) {
    console.error("[BlogPostPage] Erro ao buscar post:", err);
  }

  if (!post) {
    return notFound();
  }

  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="min-h-screen pt-28 pb-16 bg-slate-50 dark:bg-slate-950">
      
      {/* Cabeçalho do Artigo */}
      <header className="page-shell max-w-4xl mx-auto mb-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Blog
        </Link>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
          {post.title}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-t border-b border-slate-200 dark:border-slate-800 py-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium text-slate-900 dark:text-white">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <time>{publishDate}</time>
          </div>
        </div>
      </header>

      {/* Imagem de Capa (se houver) */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Conteúdo do Artigo */}
      <div className="page-shell max-w-3xl mx-auto">
        <div 
          className="prose prose-lg dark:prose-invert prose-blue max-w-none mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Seção de Comentários e Interações */}
        <BlogCommentSection 
          postId={post._id} 
          initialLikes={post.likesCount} 
          initialComments={post.commentsCount} 
          isLoggedIn={isLoggedIn} 
        />
      </div>

    </article>
  );
}
