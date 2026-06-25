import { error } from "@sveltejs/kit";

const posts = import.meta.glob("/src/lib/posts/*.svx");

export async function load({ params }) {
  const match = posts[`/src/lib/posts/${params.slug}.svx`];

  if (!match) {
    throw error(404, "Post not found");
  }

  const post = await match();

  return {
    component: post.default,
    metadata: post.metadata
  };
}
