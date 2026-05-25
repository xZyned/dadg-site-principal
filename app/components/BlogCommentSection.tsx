"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, Heart, Bookmark, Send, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogComment {
  _id: string;
  ownerId: string;
  ownerName: string;
  ownerPicture?: string;
  content: string;
  createdAt: string;
}

interface InteractionsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  isLoggedIn: boolean;
}

export default function BlogCommentSection({ postId, initialLikes, initialComments, isLoggedIn }: InteractionsProps) {
  const router = useRouter();
  
  // Status do Usuário Logado para esse Post
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  
  // Comentários
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  
  // Form
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Buscar interações e comentários
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pega comentários
        const resComments = await fetch(`/api/v1/blog/proxy/posts/${postId}/comments`);
        if (resComments.ok) {
          const data = await resComments.json();
          setComments(data.data || []);
        }

        // Se estiver logado, vê se já curtiu/favoritou
        if (isLoggedIn) {
          const resMe = await fetch(`/api/v1/blog/proxy/posts/${postId}/interactions/me`);
          if (resMe.ok) {
            const meData = await resMe.json();
            setIsLiked(meData.isLiked);
            setIsBookmarked(meData.isBookmarked);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do post:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    fetchData();
  }, [postId, isLoggedIn]);

  const handleRequireLogin = () => {
    window.location.href = `/api/auth/login?returnTo=${window.location.pathname}`;
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) return handleRequireLogin();
    if (actionLoading) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/blog/proxy/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(data.isLiked);
        setLikesCount(prev => data.isLiked ? prev + 1 : prev - 1);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isLoggedIn) return handleRequireLogin();
    if (actionLoading) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/blog/proxy/posts/${postId}/bookmark`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.isBookmarked);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return handleRequireLogin();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/blog/proxy/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setComments([data.data, ...comments]);
        setCommentsCount(prev => prev + 1);
        setNewComment("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      
      {/* Barra de Ações (Like / Bookmark) */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex gap-4">
          <button 
            onClick={handleToggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              isLiked 
                ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30" 
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            {likesCount} Curtidas
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-slate-50 text-slate-600 border border-slate-200 cursor-default dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
          >
            <MessageCircle className="w-5 h-5" />
            {commentsCount} Comentários
          </button>
        </div>

        <button 
          onClick={handleToggleBookmark}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
            isBookmarked 
              ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30" 
              : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
          Salvar
        </button>
      </div>

      {/* Seção de Comentários */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Deixe seu comentário</h3>
      
      {/* Input de Comentário */}
      <div className="mb-10">
        {isLoggedIn ? (
          <form onSubmit={handleSubmitComment} className="flex flex-col gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="O que você achou deste artigo?"
              className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Comentar
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Você precisa estar logado para comentar.</p>
            <button onClick={handleRequireLogin} className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity">
              Fazer Login
            </button>
          </div>
        )}
      </div>

      {/* Lista de Comentários */}
      <div className="space-y-6">
        {isLoadingComments ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-10">
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50">
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                {comment.ownerPicture ? (
                  <Image src={comment.ownerPicture} alt={comment.ownerName} width={40} height={40} className="object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{comment.ownerName}</h4>
                  <time className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                  </time>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
