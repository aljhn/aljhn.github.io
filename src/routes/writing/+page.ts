const posts = import.meta.glob("$lib/posts/*.svx", { eager: true });

export function load() {
    return {
        posts: Object.entries(posts).map(([path, post]) => {
            const slug = path.split("/").at(-1).replace(".svx", "");

            return {
                slug,
                metadata: post.metadata
            };
        })
    };
}
