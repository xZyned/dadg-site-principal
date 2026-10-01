import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/eventos",
    "/certificados",
    "/mural",
    "/ouvidoria",
    "/sobre",
    "/contato",
    "/coordenadorias",
    "/coordenadorias/clam",
    "/processos-seletivos",
  ].map((path) => ({ url: `https://www.dadg.com.br${path}` }));
}
