import { error } from "@sveltejs/kit";
import type { Component } from "svelte";

interface Post {
    default: Component;
    metadata: {
        title: string;
        description: string;
        date: string;
    };
}

const posts = import.meta.glob<Post>("/src/lib/posts/*.svx");

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
