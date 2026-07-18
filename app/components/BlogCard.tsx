"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MessageCircle, Heart } from "lucide-react";

export interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  authorName: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  publishedAt?: string;
  createdAt: string;
  status?: "DRAFT" | "PUBLISHED";
}

interface BlogCardProps {
  post: BlogPostData;
}

export default function BlogCard({ post }: BlogCardProps) {
  const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      
      {/* Imagem de Capa */}
      <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-blue-500/50 font-bold text-xl">DADG</span>
          </div>
        )}
        
        {/* Tag Flutuante */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1">
            <span className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
              {post.tags[0]}
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <CalendarDays className="w-3.5 h-3.5" />
          <time>{publishDate}</time>
          <span>•</span>
          <span>{post.authorName}</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>
        
        {/* Footer (Likes / Comments) */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              {post.likesCount}
            </span>
            <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              {post.commentsCount}
            </span>
          </div>
          <span className="font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
            Ler mais →
          </span>
        </div>
      </div>
    </Link>
  );
}
