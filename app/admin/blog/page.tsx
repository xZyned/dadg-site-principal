"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import { BlogPostData } from "@/app/components/BlogCard";

export default function AdminBlogDashboard() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/blog/proxy/admin/posts");
      if (res.status === 403) {
        setError("Acesso Negado. Você não é um administrador.");
        return;
      }
      if (!res.ok) throw new Error("Erro ao buscar posts");
      
      const json = await res.json();
      setPosts(json.data || []);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o artigo "${title}"?`)) return;

    try {
      const res = await fetch(`/api/v1/blog/proxy/admin/posts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Artigo excluído com sucesso.");
        fetchPosts();
      } else {
        alert(data.error || "Erro ao excluir artigo.");
      }
    } catch {
      alert("Erro de conexão ao tentar excluir.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen pt-[120px] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="glass-panel-strong dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)] p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-white/90 dark:border-white/10">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="text-red-500 w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Acesso Negado</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">{error}</p>
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] pb-12 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#002B5B]/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 glass-panel-strong p-6 md:p-8 rounded-3xl border border-white/60 dark:border-slate-800 shadow-sm">
          <div>
            <Link href="/perfil" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full transition-colors">
              <ArrowLeft size={16} /> Voltar ao Perfil
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Gerenciar Publicações</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Painel de Controle Oficial do DADG</p>
          </div>
          
          <Link 
            href="/admin/blog/editor/novo" 
            className="flex items-center gap-2 bg-[#002B5B] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(0,43,91,0.39)] hover:shadow-[0_6px_20px_rgba(0,43,91,0.23)] hover:-translate-y-0.5"
          >
            <Plus size={22} strokeWidth={2.5} />
            Novo Artigo
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nenhum artigo encontrado</h3>
            <p className="text-slate-500 dark:text-slate-400">Você ainda não publicou nenhum artigo no blog.</p>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="p-5 pl-8">Artigo</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Data de Criação</th>
                    <th className="p-5 text-right pr-8">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt="" className="w-16 h-12 object-cover rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" />
                          ) : (
                            <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                              <span className="text-slate-400 text-xs font-bold">Sem Foto</span>
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate max-w-[250px]">{post.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide flex items-center gap-2 w-max ${
                          post.status === "PUBLISHED" 
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" 
                            : "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${post.status === "PUBLISHED" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                          {post.status === "PUBLISHED" ? "PUBLICADO" : "RASCUNHO"}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-medium text-slate-600 dark:text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-5 text-right pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/blog/editor/${post._id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded-xl transition-all"
                            title="Editar"
                          >
                            <Edit size={16} /> Editar
                          </Link>
                          <button 
                            onClick={() => handleDelete(post._id, post.title)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                            title="Excluir Permanentemente"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
