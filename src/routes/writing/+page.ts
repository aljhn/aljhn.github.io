const posts = import.meta.glob("$lib/posts/*.svx", { eager: true });

export function load() {
  return {
    posts: Object.entries(posts).map(([path, post]) => {
      const slug = path.split("/").pop().replace(".svx", "");

      return {
        slug,
        metadata: post.metadata
      };
    })
  };
}
