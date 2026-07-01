import type { RequestHandler } from "./$types";

const site = "https://aljhn.github.io";
const date = new Date().toISOString().split("T")[0];
const pages = ["", "about", "quotes", "skills", "research", "writing"];

const posts = import.meta.glob<{ metadata: { date: string } }>("$lib/posts/*.svx", { eager: true });

export const prerender = true;

export const GET: RequestHandler = async () => {
    const postEntries = Object.entries(posts).map(([path, post]) => {
        const slug = path.split("/").at(-1)!.replace(".svx", "");
        const postDate = post.metadata.date ?? date;
        return { slug, date: new Date(postDate).toISOString().split("T")[0] };
    });

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
${postEntries
    .map(
        (post) => `	<url>
		<loc>${site}/writing/${post.slug}</loc>
		<lastmod>${post.date}</lastmod>
	</url>`
    )
    .join("\n")}
</urlset>`;

    return new Response(body, {
        headers: { "Content-Type": "application/xml" }
    });
};
