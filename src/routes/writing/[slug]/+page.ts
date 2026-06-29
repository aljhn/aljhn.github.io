import { error } from "@sveltejs/kit";

const posts = import.meta.glob("/src/lib/posts/*.svx", { eager: true });

export async function load({ params }) {
    const post = posts[`/src/lib/posts/${params.slug}.svx`];

    if (post === undefined) {
        throw error(404, "Post not found");
    }

    return {
        component: post.default,
        metadata: post.metadata
    };
}
