"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Image as ImageIcon } from "lucide-react";
import "react-quill/dist/quill.snow.css";

// React Quill precisa ser importado dinamicamente para não quebrar o SSR do Next.js
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function BlogEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNewPost = params.id === "novo";

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    authorName: "",
    tags: "",
    status: "DRAFT",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!isNewPost);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNewPost) {
      const fetchPost = async () => {
        try {
          // Buscamos via proxy da API pública primeiro
          const res = await fetch(`/api/v1/blog/proxy/posts`);
          const data = await res.json();
          // Aqui a rota pública não retorna draft, mas como somos admin, devíamos usar uma rota específica ou pegar pelo ID
          // No backend já existe a GET /api/v1/blog/posts/[slug] e no admin eu poderia criar a GET /api/v1/blog/admin/posts/[id]
          // Como não criei o GET por ID no admin, vamos apenas buscar a lista completa (admin) e pegar este
          const adminRes = await fetch(`/api/v1/blog/proxy/admin/posts`);
          const adminData = await adminRes.json();
          
          if (adminData.success) {
            const post = adminData.data.find((p: any) => p._id === params.id);
            if (post) {
              setFormData({
                title: post.title || "",
                slug: post.slug || "",
                excerpt: post.excerpt || "",
                content: post.content || "",
                coverImage: post.coverImage || "",
                authorName: post.authorName || "",
                tags: post.tags ? post.tags.join(", ") : "",
                status: post.status || "DRAFT",
              });
            } else {
              setError("Post não encontrado");
            }
          }
        } catch (err: any) {
          setError("Erro ao carregar os dados do post.");
        } finally {
          setIsFetching(false);
        }
      };
      fetchPost();
    }
  }, [params.id, isNewPost]);

  // Função para gerar o slug automaticamente a partir do título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => {
      // Só gera slug automaticamente se for post novo e o slug estiver vazio ou combinando
      if (isNewPost && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        return { ...prev, title, slug: generateSlug(title) };
      }
      return { ...prev, title };
    });
  };

  const generateSlug = (text: string) => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isNewPost 
        ? "/api/v1/blog/proxy/admin/posts" 
        : `/api/v1/blog/proxy/admin/posts/${params.id}`;
        
      const method = isNewPost ? "POST" : "PUT";

      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : []
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/blog");
      } else {
        setError(data.error || "Erro ao salvar post.");
      }
    } catch (err) {
      setError("Erro de conexão ao salvar post.");
    } finally {
      setIsLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
      setSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen pt-[100px] flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] pb-12 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#002B5B]/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 glass-panel-strong p-6 md:p-8 rounded-3xl border border-white/60 dark:border-slate-800 shadow-sm">
          <div>
            <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full transition-colors">
              <ArrowLeft size={16} /> Voltar ao Painel
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {isNew ? "Criar Novo Artigo" : "Editar Artigo"}
            </h1>
          </div>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white transition-all"
                >
                  <option value="DRAFT">Rascunho (Privado)</option>
                  <option value="PUBLISHED">Publicado (Público)</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resumo (Excerpt) *</label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white transition-all resize-none"
                  placeholder="Um breve resumo que aparecerá no card do artigo..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">URL da Imagem de Capa</label>
                <div className="flex gap-2">
                  <span className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-slate-500">
                    <ImageIcon size={18} />
                  </span>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white transition-all"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                <p className="text-xs text-slate-500">Você pode colocar o link de uma imagem do Google Drive, Imgur, etc.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nome do Autor</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="Ex: Diretório Acadêmico"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tags (Separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="Dicas, Eventos, Avisos"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Conteúdo *</label>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 dark:[&_.ql-toolbar]:border-slate-700 [&_.ql-toolbar]:bg-slate-50 dark:[&_.ql-toolbar]:bg-slate-800 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[300px] dark:[&_.ql-editor]:text-white">
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={(content) => setFormData({...formData, content})}
                  modules={modules}
                  placeholder="Escreva o artigo completo aqui..."
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/admin/blog"
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save size={20} />
                    {isNewPost ? "Publicar Artigo" : "Salvar Alterações"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
