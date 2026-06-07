import type { RequestHandler } from "./$types";

const site = "https://aljhn.github.io";
const date = new Date().toISOString().split("T")[0];
const pages = ["", "about", "quotes", "skills", "research"];

export const prerender = true;

export const GET: RequestHandler = async () => {
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(
        (page) => `	<url>
		<loc>${site}/${page}</loc>
		<lastmod>${date}</lastmod>
	</url>`
    )
    .join("\n")}
</urlset>`;

    return new Response(body, {
        headers: { "Content-Type": "application/xml" }
    });
};
