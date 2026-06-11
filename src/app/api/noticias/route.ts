import Parser from "rss-parser";

type Noticia = {
  categoria: string;
  titulo: string;
  fuente: string;
  url: string;
};

const FEEDS: { url: string; categoria: string; fuente: string }[] = [
  { url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml", categoria: "Últimas", fuente: "La Nación" },
  { url: "https://www.clarin.com/rss/deportes/", categoria: "Deportes", fuente: "Clarín" },
  { url: "https://www.clarin.com/rss/economia/", categoria: "Economía", fuente: "Clarín" },
  { url: "https://www.clarin.com/rss/politica/", categoria: "Política", fuente: "Clarín" },
  { url: "https://www.clarin.com/rss/espectaculos/", categoria: "Espectáculos", fuente: "Clarín" },
  { url: "https://www.clarin.com/rss/mundo/", categoria: "El Mundo", fuente: "Clarín" },
  { url: "https://www.ambito.com/rss/pages/economia.xml", categoria: "Economía", fuente: "Ámbito" },
  { url: "https://www.ambito.com/rss/pages/deportes.xml", categoria: "Deportes", fuente: "Ámbito" },
  { url: "https://www.ambito.com/rss/pages/politica.xml", categoria: "Política", fuente: "Ámbito" },
];

const ITEMS_PER_FEED = 5;
const parser = new Parser({ timeout: 8000 });

// Se ejecuta por request (no en build) y se cachea en el CDN 30 min.
export const dynamic = "force-dynamic";

export async function GET() {
  const resultados: Noticia[] = [];

  await Promise.allSettled(
    FEEDS.map(async ({ url, categoria, fuente }) => {
      const feed = await parser.parseURL(url);
      for (const item of (feed.items ?? []).slice(0, ITEMS_PER_FEED)) {
        const titulo = item.title?.trim();
        if (titulo) {
          resultados.push({ categoria, titulo, fuente, url: item.link ?? "" });
        }
      }
    }),
  );

  // Mezclar para no agrupar la misma fuente.
  for (let i = resultados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultados[i], resultados[j]] = [resultados[j], resultados[i]];
  }

  return Response.json(resultados, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
