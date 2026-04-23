"use client";

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import { ObjectId } from "bson";
import { Download, Eye, LoaderCircle, Maximize2, Sparkles } from "lucide-react";
import Kindred from "@/public/fonts/lib/libFontKindred";
import { useRouter } from "next/navigation";
import { ICertificateWithEventIdPopulate } from "@/app/lib/models/CertificateModel";
import { libSourceSerif4 } from "@/public/fonts/lib/libSourceSerif4";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

const CERTIFICATE_WIDTH = 2000;
const CERTIFICATE_HEIGHT = 1414;

type ViewerMode = "fit" | "reading" | "full";

type StageProps = {
  stageId?: string;
  imageSrc: string;
  alt: string;
  onAssetLoad?: () => void;
  onAssetError?: () => void;
};

type PreviewViewportProps = {
  title: string;
  description: string;
  assetLoading: boolean;
  assetLoadingTitle: string;
  assetLoadingDescription: string;
  viewMode: ViewerMode;
  children: React.ReactNode;
};

function formatScaleLabel(scale: number) {
  return `${Math.round(scale * 100)}%`;
}

function LoadingScreen() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden text-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,143,214,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(239,246,255,0.94)_100%)]" />

      <div className="page-shell relative flex min-h-screen items-center justify-center py-10">
        <section className="glass-panel-strong surface-outline relative w-full max-w-5xl overflow-hidden rounded-[38px] border border-white/70 px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute inset-0 opacity-70">
            <div className="soft-grid absolute inset-0" />
            <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-[rgba(79,143,214,0.12)] blur-3xl" />
            <div className="absolute -left-14 bottom-0 h-48 w-48 rounded-full bg-[rgba(9,66,125,0.12)] blur-3xl" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_280px] lg:items-center">
            <div>
              <p className="section-eyebrow">Certificados</p>
              <h1 className="max-w-2xl text-4xl font-medium tracking-[0.02em] text-slate-950 dark:text-white sm:text-5xl" style={Kindred.style}>
                Preparando seu certificado
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Estamos buscando os dados oficiais, carregando o fundo e alinhando os textos para liberar uma visualizacao fiel.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  "Buscando os dados do certificado",
                  "Carregando a arte original",
                  "Sincronizando a composicao do texto",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/80 bg-white/84 px-4 py-4 text-sm font-medium text-slate-600 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/78 dark:text-slate-300"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin text-[var(--brand-800)]" />
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Em andamento</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[280px]">
              <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_top,rgba(79,143,214,0.26),transparent_58%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/90 p-4 shadow-[0_30px_80px_rgba(4,26,49,0.14)] dark:border-white/10 dark:bg-slate-900/82">
                <div className="relative aspect-[2000/1414] overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f3f7fc_100%)] p-5">
                  <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_22%,rgba(79,143,214,0.18)_50%,transparent_78%)] animate-pulse" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-3 w-28 rounded-full bg-[rgba(9,66,125,0.12)]" />
                      <div className="h-3 w-20 rounded-full bg-[rgba(9,66,125,0.08)]" />
                    </div>

                    <div className="space-y-4">
                      <div className="mx-auto h-5 w-3/4 rounded-full bg-[rgba(9,66,125,0.14)]" />
                      <div className="mx-auto h-3 w-2/5 rounded-full bg-[rgba(9,66,125,0.1)]" />
                      <div className="mx-auto h-3 w-4/5 rounded-full bg-[rgba(9,66,125,0.08)]" />
                      <div className="mx-auto h-3 w-3/5 rounded-full bg-[rgba(9,66,125,0.08)]" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="h-12 w-28 rounded-[16px] bg-[rgba(9,66,125,0.12)]" />
                      <div className="h-10 w-20 rounded-full bg-[rgba(79,143,214,0.14)]" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] border border-[rgba(9,66,125,0.08)] bg-[rgba(239,246,255,0.92)] px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Visualizador</p>
                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">Ajustando a moldura sem tocar no encaixe fino do certificado.</p>
                  </div>
                  <Sparkles className="h-5 w-5 flex-none text-[var(--brand-700)]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PreviewAssetOverlay({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="absolute inset-3 z-20 flex items-center justify-center rounded-[24px] bg-[rgba(255,255,255,0.78)] p-5 backdrop-blur-md sm:inset-4">
      <div className="w-full max-w-md rounded-[26px] border border-white/80 bg-white/92 px-5 py-5 text-center shadow-[0_24px_64px_rgba(4,26,49,0.14)] dark:border-white/10 dark:bg-slate-900/92">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(9,66,125,0.08)] text-[var(--brand-800)]">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Carregando</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function PreviewViewport({
  title,
  description,
  assetLoading,
  assetLoadingTitle,
  assetLoadingDescription,
  viewMode,
  children,
}: PreviewViewportProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(CERTIFICATE_WIDTH);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const updateWidth = () => {
      setAvailableWidth(element.clientWidth || CERTIFICATE_WIDTH);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const fitScale = Math.min(1, availableWidth / CERTIFICATE_WIDTH);
  const readingScale = Math.min(1, Math.max(fitScale, 0.48));
  const currentScale = viewMode === "fit" ? fitScale : viewMode === "reading" ? readingScale : 1;

  return (
    <section className="glass-panel-strong surface-outline overflow-hidden rounded-[32px] border border-white/70 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{title}</p>
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p> : null}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-4 py-2 text-sm font-semibold text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
          <Eye className="h-4 w-4" />
          Escala {formatScaleLabel(currentScale)}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative overflow-auto rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#fbfdff_0%,#eef4fb_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-4"
      >
        {assetLoading ? <PreviewAssetOverlay title={assetLoadingTitle} description={assetLoadingDescription} /> : null}

        <div className="relative mx-auto" style={{ width: `${CERTIFICATE_WIDTH * currentScale}px`, height: `${CERTIFICATE_HEIGHT * currentScale}px` }}>
          <div
            className="origin-top-left overflow-hidden rounded-[24px] bg-white shadow-[0_30px_80px_rgba(4,26,49,0.18)]"
            style={{
              width: `${CERTIFICATE_WIDTH}px`,
              height: `${CERTIFICATE_HEIGHT}px`,
              transform: `scale(${currentScale})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function ViewerControls({
  viewMode,
  onModeChange,
  onDownload,
  isDownloading,
  isDownloadDisabled,
  showViewModes,
}: {
  viewMode: ViewerMode;
  onModeChange: (mode: ViewerMode) => void;
  onDownload: () => Promise<void>;
  isDownloading: boolean;
  isDownloadDisabled: boolean;
  showViewModes: boolean;
}) {
  const buttonClass = (isActive: boolean) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-950 text-white shadow-[0_18px_40px_rgba(4,26,49,0.18)]"
        : "bg-white text-slate-700 hover:bg-[var(--brand-50)] dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/18"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showViewModes ? (
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/70 bg-white/82 p-1 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/12 dark:bg-slate-900/76">
          <button type="button" onClick={() => onModeChange("fit")} className={buttonClass(viewMode === "fit")}>
            <Eye className="h-4 w-4" />
            Ajustar
          </button>
          <button type="button" onClick={() => onModeChange("reading")} className={buttonClass(viewMode === "reading")}>
            <Sparkles className="h-4 w-4" />
            Leitura
          </button>
          <button type="button" onClick={() => onModeChange("full")} className={buttonClass(viewMode === "full")}>
            <Maximize2 className="h-4 w-4" />
            100%
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          void onDownload();
        }}
        disabled={isDownloadDisabled}
        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(4,26,49,0.18)] transition hover:bg-[var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isDownloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {isDownloading ? "Preparando arquivo..." : "Baixar certificado"}
      </button>
    </div>
  );
}

function StandardFrontStage({ stageId, imageSrc, alt, onAssetLoad, onAssetError, data }: StageProps & { data: ICertificateWithEventIdPopulate }) {
  const hasStructuredText = Boolean(data.frontBottomText && data.frontTopperText);

  if (!hasStructuredText) {
    return (
      <div id={stageId} className="relative bg-white" style={{ width: `${CERTIFICATE_WIDTH}px`, height: `${CERTIFICATE_HEIGHT}px` }}>
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-fill"
          draggable={false}
          onLoad={onAssetLoad}
          onError={onAssetError}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center font-bold">
          <div className="w-[70%]">
            <div className="relative mb-[115px] flex w-full flex-col items-center justify-center space-y-5">
              <p style={{ ...libSourceSerif4.style, fontWeight: "400" }}>{data.ownerName}</p>
              <br />
              <p className="font-thin">Codigo de verificacao: {String(data._id)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={stageId} className="relative bg-white" style={{ width: `${CERTIFICATE_WIDTH}px`, height: `${CERTIFICATE_HEIGHT}px` }}>
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full object-fill"
        draggable={false}
        onLoad={onAssetLoad}
        onError={onAssetError}
      />
      <div className="absolute left-[-125px] top-[350px] flex items-center justify-center">
        <div className="w-[85%]">
          <div className="flex flex-col items-center justify-center space-y-5 font-bold">
            <div className="relative flex w-full flex-col items-center justify-center space-y-5" style={{ ...data.eventId.styleContainer }}>
              <p style={{ ...libSourceSerif4.style, ...data.eventId.styleFrontTopperText }}>{data.frontTopperText ?? ""}</p>
              <p style={{ ...libSourceSerif4.style, ...data.eventId.styleNameText }}>{data.ownerName.toUpperCase()}</p>
              <p className="font-thin">Codigo de verificacao: {String(data._id)}</p>
              <p className="whitespace-pre-line" style={{ ...libSourceSerif4.style, ...data.eventId.styleFrontBottomText, whiteSpace: "pre-wrap" }}>
                {(data.frontBottomText ?? "")
                  .replace(/\\n/g, "\n")
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={`${String(data._id)}-${index}`}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageOnlyStage({ stageId, imageSrc, alt, onAssetLoad, onAssetError }: StageProps) {
  return (
    <div id={stageId} className="relative bg-white" style={{ width: `${CERTIFICATE_WIDTH}px`, height: `${CERTIFICATE_HEIGHT}px` }}>
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full object-fill"
        draggable={false}
        onLoad={onAssetLoad}
        onError={onAssetError}
      />
    </div>
  );
}

function VerseStage({
  stageId,
  imageSrc,
  alt,
  onAssetLoad,
  onAssetError,
  data,
}: StageProps & { data: ICertificateWithEventIdPopulate }) {
  return (
    <div id={stageId} className="relative bg-white" style={{ width: `${CERTIFICATE_WIDTH}px`, height: `${CERTIFICATE_HEIGHT}px` }}>
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full object-fill"
        draggable={false}
        onLoad={onAssetLoad}
        onError={onAssetError}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center font-bold">
        <table style={{ ...data.eventId.styleContainerVerse?.containerStyle, ...data.eventId.styleContainerVerse?.headerStyle }}>
          <thead>
            <tr>
              {data.verse?.headers?.map((header, index) => (
                <th key={`${header}-${index}`} className="text-center text-lg font-bold" style={{ ...data.eventId.styleContainerVerse?.headerStyle }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.verse?.rows?.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className="text-center"
                    style={{ ...libSourceSerif4.style, ...data.eventId.styleContainerVerse?.rowsStyle }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Home({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFrontAssetLoading, setIsFrontAssetLoading] = useState(true);
  const [isVerseAssetLoading, setIsVerseAssetLoading] = useState(false);
  const [data, setData] = useState<ICertificateWithEventIdPopulate | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [assetToken, setAssetToken] = useState(() => `${Date.now()}`);
  const [viewMode, setViewMode] = useState<ViewerMode>("reading");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const { certificateId: resolvedCertificateId } = await params;
        if (!isMounted) return;

        setCertificateId(resolvedCertificateId);
        setAssetToken(`${Date.now()}`);

        const response = await fetch(`/api/get/myCertificateById/${resolvedCertificateId}`);

        if (!response.ok) {
          router.push("/_error");
          return;
        }

        const responseJson: { data: ICertificateWithEventIdPopulate } = await response.json();
        if (!isMounted) return;

        setData({ ...responseJson.data });
      } catch (error) {
        console.error("Erro ao carregar certificado:", error);
        if (isMounted) {
          router.push("/_error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [params, router]);

  useEffect(() => {
    if (!data) return;

    setIsFrontAssetLoading(true);
    setIsVerseAssetLoading(Boolean(data.verse?.showVerse));
  }, [data, assetToken]);

  const isScanTemplate = Boolean(data?.certificatePath && ObjectId.isValid(String(data.certificatePath)));
  const isImageOnly = Boolean(data?.onlyImage);
  const hasVerse = Boolean(data?.verse?.showVerse);

  const frontImageSrc = certificateId ? `/api/get/templateProxy/${certificateId}|front?t=${assetToken}` : "";
  const verseImageSrc = certificateId ? `/api/get/templateProxy/${certificateId}|verse?t=${assetToken}` : "";
  const scanTemplateSrc = data?.certificatePath ? `/api/get/templateScanProxy/${String(data.certificatePath)}|front?t=${assetToken}` : "";

  const handleServerDownload = async () => {
    if (!certificateId) return;

    setIsDownloading(true);

    try {
      const response = await fetch(`/api/get/downloadCertificate/${certificateId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Falha ao baixar arquivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${data?.eventName ?? "certificado"} - ${data?.ownerName ?? "documento"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro no download:", error);
      alert("Erro ao baixar o certificado.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRenderedDownload = async () => {
    const frontElement = document.getElementById("frontCert");
    if (!frontElement) return;

    setIsDownloading(true);

    try {
      const captureScale = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));

      const frontCanvas = await html2canvas(frontElement, {
        backgroundColor: "#ffffff",
        scale: captureScale,
        useCORS: true,
      });

      const frontBlob = await (await fetch(frontCanvas.toDataURL("image/png"))).blob();

      const pdfDoc = await PDFDocument.create();
      const frontArrayBuffer = await frontBlob.arrayBuffer();
      const pngImage = await pdfDoc.embedPng(frontArrayBuffer);
      const { width, height } = pngImage.scale(1);

      const page = pdfDoc.addPage([width, height]);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width,
        height,
      });

      if (hasVerse) {
        const verseElement = document.getElementById("verseCert");

        if (verseElement) {
          const verseCanvas = await html2canvas(verseElement, {
            backgroundColor: "#ffffff",
            scale: captureScale,
            useCORS: true,
          });

          const verseBlob = await (await fetch(verseCanvas.toDataURL("image/png"))).blob();
          const verseArrayBuffer = await verseBlob.arrayBuffer();
          const verseImage = await pdfDoc.embedPng(verseArrayBuffer);

          pdfDoc.addPage([width, height]).drawImage(verseImage, {
            x: 0,
            y: 0,
            width,
            height,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const pdfArrayBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(pdfArrayBuffer).set(pdfBytes);
      const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `${data?.eventName ?? "certificado"} - ${data?.ownerName ?? "documento"}.pdf`;
      link.click();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao gerar arquivo do certificado:", error);
      alert("Erro ao baixar o certificado.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!data) {
    return null;
  }

  return (
    <main className="relative isolate overflow-hidden pb-10 text-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(79,143,214,0.18),transparent_52%)]" />
        <div className="absolute left-[-120px] top-12 h-64 w-64 rounded-full bg-[rgba(9,66,125,0.08)] blur-3xl" />
        <div className="absolute right-[-80px] top-28 h-56 w-56 rounded-full bg-[rgba(79,143,214,0.14)] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 opacity-80">
        <Fireworks
          autorun={{
            speed: 1.5,
            duration: 1500,
            delay: 0,
          }}
        />
      </div>

      <div className="page-shell relative z-10 space-y-6 py-6 sm:py-8">
        <section className="glass-panel-strong surface-outline relative overflow-hidden rounded-[34px] border border-white/70 px-5 py-6 sm:px-7">
          <div className="absolute inset-0 opacity-70">
            <div className="soft-grid absolute inset-0" />
            <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-[rgba(79,143,214,0.14)] blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Visualizacao do certificado</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Mostrador ajustado sem mexer na composicao interna</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                O quadro abaixo pode ser ajustado para leitura e enquadramento, mas o fundo e o texto continuam posicionados no canvas original do certificado.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 font-medium text-slate-700 shadow-[0_16px_32px_rgba(7,48,89,0.08)] dark:border-[rgba(148,163,184,0.22)] dark:bg-[rgba(15,23,42,0.96)] dark:text-slate-200 dark:shadow-[0_18px_40px_rgba(2,6,23,0.34)]">
                  <span className="text-slate-600 dark:text-slate-300">Evento:</span>
                  <strong className="text-slate-950 dark:text-white">{data.eventName}</strong>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 font-medium text-slate-700 shadow-[0_16px_32px_rgba(7,48,89,0.08)] dark:border-[rgba(148,163,184,0.22)] dark:bg-[rgba(15,23,42,0.96)] dark:text-slate-200 dark:shadow-[0_18px_40px_rgba(2,6,23,0.34)]">
                  <span className="text-slate-600 dark:text-slate-300">Titular:</span>
                  <strong className="text-slate-950 dark:text-white">{data.ownerName}</strong>
                </span>
              </div>
            </div>

            <ViewerControls
              viewMode={viewMode}
              onModeChange={setViewMode}
              onDownload={isScanTemplate || isImageOnly ? handleServerDownload : handleRenderedDownload}
              isDownloading={isDownloading}
              isDownloadDisabled={isDownloading || (!isScanTemplate && !isImageOnly && (isFrontAssetLoading || (hasVerse && isVerseAssetLoading)))}
              showViewModes={!isScanTemplate}
            />
          </div>
        </section>

        {isScanTemplate ? (
          <section className="glass-panel-strong surface-outline overflow-hidden rounded-[32px] border border-white/70 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Arquivo original</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Esta visualizacao vem diretamente do arquivo oficial do certificado. O enquadramento foi melhorado sem alterar o documento em si.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-50)] px-4 py-2 text-sm font-semibold text-[var(--brand-800)] dark:bg-white/10 dark:text-blue-100">
                <Eye className="h-4 w-4" />
                Visualizador ativo
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(4,26,49,0.16)]">
              {isFrontAssetLoading ? (
                <PreviewAssetOverlay
                  title="Abrindo o arquivo do certificado"
                  description="Estamos carregando a visualizacao original para manter o enquadramento fiel ao documento."
                />
              ) : null}

              <iframe
                title={`Visualizacao do certificado ${data.eventName}`}
                className="h-[72svh] min-h-[540px] w-full bg-white sm:h-[78svh]"
                src={scanTemplateSrc}
                onLoad={() => setIsFrontAssetLoading(false)}
              />
            </div>
          </section>
        ) : (
          <>
            <PreviewViewport
              title="Frente do certificado"
              description=""
              assetLoading={isFrontAssetLoading}
              assetLoadingTitle={isImageOnly ? "Carregando a arte do certificado" : "Sincronizando fundo e texto"}
              assetLoadingDescription={
                isImageOnly
                  ? "Assim que a imagem original terminar de carregar, o quadro fica livre para leitura e download."
                  : "Estamos aguardando a arte e o texto dinâmico ficarem prontos para liberar uma visualizacao fiel."
              }
              viewMode={viewMode}
            >
              {isImageOnly ? (
                <ImageOnlyStage
                  imageSrc={frontImageSrc}
                  alt={`Frente do certificado de ${data.ownerName}`}
                  onAssetLoad={() => setIsFrontAssetLoading(false)}
                  onAssetError={() => setIsFrontAssetLoading(false)}
                />
              ) : (
                <StandardFrontStage
                  imageSrc={frontImageSrc}
                  alt={`Frente do certificado de ${data.ownerName}`}
                  onAssetLoad={() => setIsFrontAssetLoading(false)}
                  onAssetError={() => setIsFrontAssetLoading(false)}
                  data={data}
                />
              )}
            </PreviewViewport>

            {hasVerse ? (
              <PreviewViewport
                title="Verso do certificado"
                description="O verso segue o mesmo enquadramento do viewer para manter a leitura consistente."
                assetLoading={isVerseAssetLoading}
                assetLoadingTitle="Carregando o verso"
                assetLoadingDescription="Estamos aguardando o verso completar o carregamento para manter a visualizacao uniforme."
                viewMode={viewMode}
              >
                {isImageOnly ? (
                  <ImageOnlyStage
                    imageSrc={verseImageSrc}
                    alt={`Verso do certificado de ${data.ownerName}`}
                    onAssetLoad={() => setIsVerseAssetLoading(false)}
                    onAssetError={() => setIsVerseAssetLoading(false)}
                  />
                ) : (
                  <VerseStage
                    imageSrc={verseImageSrc}
                    alt={`Verso do certificado de ${data.ownerName}`}
                    onAssetLoad={() => setIsVerseAssetLoading(false)}
                    onAssetError={() => setIsVerseAssetLoading(false)}
                    data={data}
                  />
                )}
              </PreviewViewport>
            ) : null}
          </>
        )}

      </div>

      {!isScanTemplate && !isImageOnly ? (
        <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 -z-10 opacity-0">
          <StandardFrontStage stageId="frontCert" imageSrc={frontImageSrc} alt="Frente do certificado para captura" data={data} />
          {hasVerse ? <VerseStage stageId="verseCert" imageSrc={verseImageSrc} alt="Verso do certificado para captura" data={data} /> : null}
        </div>
      ) : null}
    </main>
  );
}
