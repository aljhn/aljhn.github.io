const posts = import.meta.glob("$lib/posts/*.svx");

export async function load() {
    const entries = await Promise.all(
        Object.entries(posts).map(async ([path, importer]) => {
            const post = await importer();
            const slug = path.split("/").at(-1)!.replace(".svx", "");
            return { slug, metadata: post.metadata };
        })
    );
    return { posts: entries };
}
