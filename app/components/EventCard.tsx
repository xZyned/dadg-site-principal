"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, CircleDollarSign, Gift, Info, Loader2, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/lib/userProvider";

interface EventData { _id:string; eventName:string; eventDescription:string; eventBenefits?:string; eventType:string; registrationCount:number; maxParticipants:number; isOpen:boolean; isPaid:boolean; price?:number }
interface EventCardProps { event:EventData; isSubscribed:boolean; isLoggedIn:boolean; onSubscriptionChange?:()=>void|Promise<void> }

export default function EventCard({ event, isSubscribed:initialSubscribed, isLoggedIn, onSubscriptionChange }:EventCardProps) {
  const router=useRouter();
  const { profileComplete, privacyNoticeRequired, status }=useUserContext();
  const [isSubscribed,setIsSubscribed]=useState(initialSubscribed);
  const [isLoading,setIsLoading]=useState(false);
  const [errorMsg,setErrorMsg]=useState("");
  const [showConfirmation,setShowConfirmation]=useState(false);
  const returnTo=`/eventos#evento-${event._id}`;

  useEffect(()=>{ if(!showConfirmation)return; const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setShowConfirmation(false)}; window.addEventListener("keydown",close); return()=>window.removeEventListener("keydown",close); },[showConfirmation]);
  const formatCurrency=(value?:number)=>typeof value==="number"?new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value):"Valor não informado";
  const goToProfile=()=>router.push(`/perfil?returnTo=${encodeURIComponent(returnTo)}`);

  const handleEnrollClick=()=>{
    setErrorMsg("");
    if(!isLoggedIn){window.location.href=`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;return;}
    if(isSubscribed){router.push("/perfil");return;}
    if(status==="loading"){setErrorMsg("Estamos verificando seu perfil. Tente novamente em instantes.");return;}
    if(status==="error"||!profileComplete||privacyNoticeRequired){goToProfile();return;}
    setShowConfirmation(true);
  };

  const submit=async(method:"POST"|"DELETE")=>{
    setIsLoading(true);setErrorMsg("");
    try{
      const response=await fetch(`/api/v1/events/${event._id}/registration`,{method,headers:{"Content-Type":"application/json"}});
      const data=await response.json();
      if(response.ok&&data.data?.paymentUrl){window.location.assign(data.data.paymentUrl);return;}
      if(response.ok){setIsSubscribed(method==="POST");setShowConfirmation(false);router.refresh();await onSubscriptionChange?.();}
      else if(response.status===428&&(data.code==="PROFILE_INCOMPLETE"||data.code==="PRIVACY_NOTICE_REQUIRED")){setShowConfirmation(false);goToProfile();}
      else setErrorMsg(data.error||data.message||"Não foi possível processar sua inscrição.");
    }catch{setErrorMsg("Erro de conexão. Tente novamente mais tarde.");}finally{setIsLoading(false);}
  };
  const isFull=event.registrationCount>=event.maxParticipants; const canEnroll=event.isOpen&&!isFull;

  return <>
    <article id={`evento-${event._id}`} className="glass-panel-strong surface-outline relative overflow-hidden rounded-2xl border border-white/90 dark:border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)] p-6 shadow-[0_24px_64px_rgba(4,26,49,0.14)] flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-xl duration-300 scroll-mt-28">
      <div className="flex-1"><div className="flex items-start justify-between mb-4"><span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">{event.eventType}</span>{isSubscribed?<span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={14} className="mr-1"/>Inscrito</span>:null}</div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{event.eventName}</h3><p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">{event.eventDescription}</p>
      <div className="space-y-3 mb-6"><p className="flex items-center text-sm text-slate-700 dark:text-slate-300"><CalendarDays size={16} className="mr-2 text-slate-400"/>{event.isOpen?"Inscrições abertas":"Inscrições fechadas"}</p><p className="flex items-center text-sm text-slate-700 dark:text-slate-300"><Users size={16} className="mr-2 text-slate-400"/>{event.registrationCount} / {event.maxParticipants} vagas ocupadas</p><p className="flex items-center text-sm text-slate-700 dark:text-slate-300"><CircleDollarSign size={16} className="mr-2 text-slate-400"/><strong className="text-emerald-600 dark:text-emerald-400">{event.isPaid?formatCurrency(event.price):"Gratuito"}</strong></p></div>
      {event.eventBenefits?<div className="mb-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30"><h4 className="flex items-center text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2"><Gift size={16} className="mr-2"/>Benefícios</h4><p className="text-sm text-slate-600 dark:text-slate-400">{event.eventBenefits}</p></div>:null}</div>
      {errorMsg?<div role="alert" className="mb-4 flex items-start text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md"><Info size={14} className="mr-1.5 flex-shrink-0 mt-0.5"/><span>{errorMsg}</span></div>:null}
      <button onClick={handleEnrollClick} disabled={isLoading||(!canEnroll&&!isSubscribed)} className={`mt-auto flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isSubscribed?"bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/50":!canEnroll?"bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800":"bg-slate-900 text-white hover:bg-blue-600 dark:bg-blue-600"}`}>{isLoading?<Loader2 className="animate-spin h-5 w-5"/>:isSubscribed?"Ver minha inscrição":!canEnroll?(event.isOpen?"Vagas esgotadas":"Inscrições encerradas"):!isLoggedIn?"Entrar para se inscrever":event.isPaid?"Inscrever-se e pagar":"Inscrever-se"}</button>
    </article>
    {showConfirmation?<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onMouseDown={(e)=>{if(e.target===e.currentTarget)setShowConfirmation(false)}}><section role="dialog" aria-modal="true" aria-labelledby={`confirm-${event._id}`} className="glass-panel-strong relative w-full max-w-md rounded-[28px] border border-white/20 p-6 shadow-2xl"><button type="button" onClick={()=>setShowConfirmation(false)} aria-label="Fechar" className="absolute right-4 top-4 text-slate-500 dark:text-slate-300"><X size={20}/></button><span className="section-eyebrow">Confirmar inscrição</span><h2 id={`confirm-${event._id}`} className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">{event.eventName}</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Confirme sua participação. Nome, CPF e e-mail serão obtidos com segurança do seu perfil e da conta autenticada.</p><div className="mt-6 flex gap-3"><button type="button" onClick={()=>setShowConfirmation(false)} className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700">Voltar</button><button type="button" onClick={()=>void submit("POST")} disabled={isLoading} className="flex-1 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{isLoading?"Confirmando...":"Confirmar"}</button></div></section></div>:null}
  </>;
}
