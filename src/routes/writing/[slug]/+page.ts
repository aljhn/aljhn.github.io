import { error } from "@sveltejs/kit";

const posts = import.meta.glob("/src/lib/posts/*.svx");

export async function load({ params }) {
    const importer = posts[`/src/lib/posts/${params.slug}.svx`];

    if (importer === undefined) {
        throw error(404, "Post not found");
    }

    const post = await importer();
    return {
        component: post.default,
        metadata: post.metadata
    };
}
