
"use client"
import React from 'react';
import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';
import { ObjectId } from 'bson';
import Kindred from '@/public/fonts/lib/libFontKindred';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ICertificateWithEventIdPopulate } from '@/app/lib/models/CertificateModel';
import { libSourceSerif4 } from '@/public/fonts/lib/libSourceSerif4';
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";


//  export default function Home({ params }: { params: { certificateId: string } }) {

export default function Home({
  params,
}: {
  params: Promise<{ certificateId: string }>
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<ICertificateWithEventIdPopulate | null>(null)
  const router = useRouter()
  const [certificateId, setCertificateId] = useState<null | string>(null)
  const handleDownload = async () => {
    // Seleciona o elemento da frente
    const frontElement = document.getElementById('frontCert');
    if (!frontElement) return;

    // Renderiza o front ignorando o CSS transform de escala do elemento pai no momento da captura
    const frontCanvas = await html2canvas(frontElement, {
      scale: 2, // Garante alta definição no PDF final
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('frontCert');
        if (el && el.parentElement) {
          el.parentElement.style.transform = 'none'; // Desfaz a escala apenas no clone pro html2canvas bater a foto limpa
          if (el.parentElement.parentElement) {
            el.parentElement.parentElement.style.width = '2000px';
            el.parentElement.parentElement.style.height = '1414px';
          }
        }
      }
    });

    const imgUrl = frontCanvas.toDataURL('image/png');
    const response = await fetch(imgUrl);
    const blob = await response.blob();

    const pdfDoc = await PDFDocument.create();
    const arrayBuffer = await blob.arrayBuffer();
    const pngImage = await pdfDoc.embedPng(arrayBuffer);
    
    // Scale 1 aqui pra manter o tamanho pro PDF
    const { width, height } = pngImage.scale(1);

    // Adiciona a página da frente
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width,
      height,
    });

    // Se houver verso, renderiza e adiciona ao PDF
    if (data?.verse?.showVerse === true) {
      const backElement = document.getElementById('verseCert');
      if (backElement) {
        const backCanvas = await html2canvas(backElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('verseCert');
            if (el && el.parentElement) {
              el.parentElement.style.transform = 'none';
              if (el.parentElement.parentElement) {
                el.parentElement.parentElement.style.width = '2000px';
                el.parentElement.parentElement.style.height = '1414px';
              }
            }
          }
        });
        const imgUrlVerse = backCanvas.toDataURL('image/png');
        const responseBack = await fetch(imgUrlVerse);
        const blobVerse = await responseBack.blob();
        const arrayBufferVerse = await blobVerse.arrayBuffer();
        const pngImageVerse = await pdfDoc.embedPng(arrayBufferVerse);

        pdfDoc.addPage([width, height]).drawImage(pngImageVerse, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }
    }

    // Gera os bytes do PDF
    const pdfBytes = await pdfDoc.save();
    // Cria um Blob para o PDF
    // @ts-expect-error: Erro de tipificação
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    // Cria uma URL para o Blob e força o download
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${data?.eventName} - ${data?.ownerName}.pdf`;
    link.click();
    // Revoga a URL criada
    URL.revokeObjectURL(blobUrl);
  };


  useEffect(() => {
    const fetchData = async () => {
      const { certificateId } = await params
      setCertificateId(certificateId)
      const fetchData = await fetch(`/api/get/myCertificateById/${certificateId}`)

      if (!fetchData.ok) {
        router.push("/_error")
        return;
      }

      const fetchDataJson: { data: ICertificateWithEventIdPopulate, } = await fetchData.json()
      setData({ ...fetchDataJson.data, })
      setIsLoading(false)

    }
    fetchData()

  }, [params, router])

  const [certScale, setCertScale] = useState<number>(1);
  useEffect(() => {
    const updateScale = () => {
      const paddingX = window.innerWidth < 768 ? 32 : 80;
      const paddingY = window.innerWidth < 768 ? 200 : 250;
      const w = window.innerWidth - paddingX;
      const h = window.innerHeight - paddingY;
      const scale = Math.min(w / 2000, h / 1414, 1);
      setCertScale(scale);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (isLoading) {
    return (
      <main className="relative flex flex-col max-w-screen overflow-hidden">
        <div className="fixed inset-0 flex items-center justify-center bg-[#09427D] bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg" onClick={() => {
              // isso daqui so serve para eu colocar as fontes que uso, e conseguir contornar o ESlint rules.
              console.log(Kindred)
            }}>C A R R E G A N D O</p>
          </div>
        </div>

      </main>
    )
  }
  if (data?.certificatePath && ObjectId.isValid(String(data?.certificatePath))) {
    return (
      <main className="relative flex flex-col max-w-screen overflow-hidden bg-slate-50 dark:bg-[#001021] min-h-screen">
        <div className='absolute min-h-svg min-w-full z-[500] pointer-events-none'>
          <Fireworks autorun={{
            speed: 1.5,
            duration: 1500,
            delay: 0
          }} />
        </div>
        
        {/* Spacer to prevent navbar overlap */}
        <div className="w-full pt-24 md:pt-32" />

        <div className="relative w-full flex justify-center py-6 px-4">
          <div id="frontCert" className="w-full max-w-5xl">
            <iframe
              className='w-full h-[75vh] min-h-[500px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-xl border border-slate-200 dark:border-white/10'
              src={`/api/get/templateScanProxy/${data.certificatePath}|front?t=${Date.now()}`} /* Date.now() é para resolver o problema do Cache. */
            />
          </div>
        </div>

        {/* Botão de Download na Parte Inferior */}
        <div className="flex justify-center items-center px-5 pb-20 pt-10 w-full z-50 flex-col gap-4">
          <button
            className="flex items-center gap-2 px-8 py-4 bg-[#002B5B] dark:bg-blue-600 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            onClick={async () => {
              try {
                const response = await fetch(`/api/get/templateScanProxy/${data.certificatePath}|front?t=${Date.now()}`, {
                  method: 'GET',
                });

                if (!response.ok) throw new Error('Falha ao baixar arquivo');

                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `${data.eventName} - ${data.ownerName}.pdf`; // Nome que o arquivo terá no PC
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

              } catch (error) {
                console.error("Erro no download:", error);
                alert("Erro ao baixar o certificado.");
              }
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            BAIXAR CERTIFICADO
          </button>
          <p className="text-slate-500 dark:text-blue-200/60 text-sm font-medium text-center">
            Faça o download para imprimir ou guardar em alta resolução
          </p>
        </div>
      </main>
    )
  }

  if (data?.onlyImage === true) {
    return (
      <main className="relative flex flex-col max-w-screen overflow-hidden bg-slate-50 dark:bg-[#001021] min-h-screen">
        <div className='absolute min-h-svg min-w-full z-[500] pointer-events-none'>
          <Fireworks autorun={{
            speed: 1.5,
            duration: 1500,
            delay: 0
          }} />
        </div>
        
        {/* Spacer to prevent navbar overlap */}
        <div className="w-full pt-24 md:pt-32" />

        <article className="relative w-full flex justify-center py-6 overflow-hidden">
          <div style={{ width: 2000 * certScale, height: 1414 * certScale, margin: '0 auto' }}>
            <div style={{ transform: `scale(${certScale})`, transformOrigin: 'top left' }}>
              <div id="frontCert" style={{ width: '2000px', height: '1414px', position: 'relative' }} className="shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <img
                  src={`/api/get/templateProxy/${certificateId}|front?t=${Date.now()}`} /* Date.now() é para resolver o problema do Cache. */
                  className="w-full h-full object-fill"
                />
              </div>
            </div>
          </div>
        </article>

        {/* Botão de Download na Parte Inferior */}
        <div className="flex justify-center items-center px-5 pb-20 pt-10 w-full z-50 flex-col gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-8 py-4 bg-[#002B5B] dark:bg-blue-600 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            BAIXAR CERTIFICADO
          </button>
          <p className="text-slate-500 dark:text-blue-200/60 text-sm font-medium text-center">
            Faça o download para imprimir ou guardar em alta resolução
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex flex-col max-w-screen overflow-hidden bg-slate-50 dark:bg-[#001021] min-h-screen">
      <div className='absolute min-h-svg min-w-full z-[500] pointer-events-none'>
        <Fireworks autorun={{
          speed: 1.5,
          duration: 1500,
          delay: 0
        }} />
      </div>

      {/* Spacer to prevent navbar overlap */}
      <div className="w-full pt-24 md:pt-32" />

      {/* Área de exibição dos certificados */}
      {
        !data?.frontBottomText || !data?.frontTopperText ?
          <article className="relative w-full flex justify-center py-6 overflow-hidden">
            {/* Frente do Certificado */}
            <div style={{ width: 2000 * certScale, height: 1414 * certScale, margin: '0 auto' }}>
              <div style={{ transform: `scale(${certScale})`, transformOrigin: 'top left' }}>
                <div
                  id="frontCert"
                  className="relative shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                  style={{ width: '2000px', height: '1414px', position: 'relative' }}
                >
                  <img
                    src={`/api/get/templateProxy/${certificateId}|front?t=${Date.now()}`} /* Date.now() é para resolver o problema do Cache. */
                    alt="Certificado"
                    className="w-full h-full object-fill"
                  />
                  <div className="absolute flex flex-col items-center justify-center top-0 font-bold w-full h-full">
                    <div className=' w-[70%]'>
                      <div className="relative flex flex-col space-y-5 items-center content-center justify-center mb-[115px] w-full ">
                        <p className="" style={{ ...libSourceSerif4.style, fontWeight: "400" }}>{data?.ownerName}</p>
                        <br />
                        <p className='font-thin'>
                          Código de Verificação: {String(data?._id)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          :
          <article className="relative w-full flex justify-center py-6 overflow-hidden">
            {/* Frente do Certificado */}
            <div style={{ width: 2000 * certScale, height: 1414 * certScale, margin: '0 auto' }}>
              <div style={{ transform: `scale(${certScale})`, transformOrigin: 'top left' }}>
                <div
                  id="frontCert"
                  className="relative shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                  style={{ width: '2000px', height: '1414px', position: 'relative' }}
                >
                  <img
                    src={`/api/get/templateProxy/${certificateId}|front?t=${Date.now()}`}
                    alt="Certificado"
                    className="w-full h-full object-fill"
                  />
                  <div className="absolute top-[350px] -left-[125px] flex items-center justify-center content-center">
                    <div className='w-[85%]'>
                      <div className="flex flex-col items-center justify-center font-bold space-y-5">
                        <div className="relative flex flex-col space-y-5 items-center content-center justify-center  w-full " style={{ ...data?.eventId.styleContainer, }}>
                          <p style={{ ...libSourceSerif4.style, ...data?.eventId.styleFrontTopperText }}>
                            {
                              !data?.frontTopperText ?
                                ""
                                : data?.frontTopperText
                            }
                          </p>
                          <p style={{ ...libSourceSerif4.style, ...data?.eventId.styleNameText }}>{data?.ownerName.toUpperCase()}</p>
                          <p className='font-thin' onClick={() => console.log(data)}>
                            Código de Verificação: {String(data?._id)}
                          </p>
                          <p className='whitespace-pre-line' style={{ ...libSourceSerif4.style, ...data?.eventId.styleFrontBottomText, whiteSpace: 'pre-wrap', }}>
                            {
                              !data?.frontBottomText ?
                                "" :
                                data?.frontBottomText.replace(/\\n/g, "\n").split("\n").map((linha, indice) => (
                                  <React.Fragment key={indice}>
                                    {linha}
                                    <br />
                                  </React.Fragment>
                                ))
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
      }

      {
        data?.verse?.showVerse == true &&
        <article className="relative w-full flex justify-center py-6 overflow-hidden">
          {/* Verso do Certificado */}
          <div style={{ width: 2000 * certScale, height: 1414 * certScale, margin: '0 auto' }}>
            <div style={{ transform: `scale(${certScale})`, transformOrigin: 'top left' }}>
              <div
                id="verseCert"
                className="relative shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                style={{ width: '2000px', height: '1414px', position: 'relative' }}
              >
                <img
                  src={`/api/get/templateProxy/${certificateId}|verse?t=${Date.now()}`} /* Date.now() é para resolver o problema do Cache. */
                  alt="Certificado"
                  className="w-full h-full object-fill"
                />
                <div className="absolute flex flex-col items-center justify-center top-0 font-bold w-full h-full">
                  <table style={{ ...data?.eventId?.styleContainerVerse?.containerStyle, ...data?.eventId?.styleContainerVerse?.headerStyle }}>
                    <thead className=''>
                      <tr>
                        {
                          data?.verse?.headers?.map((header, index) => (
                            <th key={index} className="text-center text-lg font-bold" style={{ ...data?.eventId?.styleContainerVerse?.headerStyle }}>
                              {header}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {
                        data?.verse?.rows?.map((row, rowIndex) => {
                          // 1. Identifica se estamos na última linha da tabela
                          const isLastRow = rowIndex === (data?.verse?.rows?.length ?? 0) - 1;
                          return (
                            <tr key={rowIndex}>
                              {
                                row.map((cell, cellIndex) => {
                                  const isCargaHoraria = cellIndex === row.length - 1;
                                  if (!isCargaHoraria && rowIndex > 0 && data?.verse?.rows && data.verse.rows[rowIndex - 1][cellIndex] === cell) {
                                    return null;
                                  }
                                  let rowSpanCount = 1;
                                  if (!isCargaHoraria) {
                                    for (let i = rowIndex + 1; i < (data?.verse?.rows?.length ?? 0); i++) {
                                      if (data?.verse?.rows && data.verse.rows[i][cellIndex] === cell) {
                                        rowSpanCount++;
                                      } else {
                                        break;
                                      }
                                    }
                                  }
                                  // 2. Define o alinhamento: 
                                  // Se for a última linha, centraliza tudo. 
                                  // Se NÃO for a última, aplica a regra anterior (coluna 2 no "start", resto no "center").
                                  const cellTextAlign = isLastRow ? "center" : (cellIndex === 1 ? "start" : "center");
                                  return (
                                    <td
                                      key={cellIndex}
                                      rowSpan={rowSpanCount > 1 ? rowSpanCount : undefined}
                                      className="text-center"
                                      style={{
                                        ...libSourceSerif4.style,
                                        ...data?.eventId?.styleContainerVerse?.rowsStyle,
                                        textAlign: cellTextAlign // Aplica a variável criada acima
                                      }}
                                    >
                                      {cell}
                                    </td>
                                  );
                                })
                              }
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                  <div className=' w-[70%]'>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      }

      {/* Botão de Download na Parte Inferior */}
      <div className="flex justify-center items-center px-5 pb-20 pt-10 w-full z-50 flex-col gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-8 py-4 bg-[#002B5B] dark:bg-blue-600 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          BAIXAR CERTIFICADO
        </button>
        <p className="text-slate-500 dark:text-blue-200/60 text-sm font-medium text-center">
          Faça o download para imprimir ou guardar em alta resolução
        </p>
      </div>
    </main >
  );
}