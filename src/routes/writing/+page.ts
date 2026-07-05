const posts = import.meta.glob("$lib/posts/*.svx");

export async function load() {
    const entries = await Promise.all(
        Object.entries(posts).map(async ([path, importer]) => {
            const post = await importer();
            const slug = path.split("/").at(-1)!.replace(".svx", "");
            const id = Number(slug.split("_").at(0));
            return {
                slug: slug,
                metadata: post.metadata,
                id: id
            };
        })
    );

    entries.sort((a, b) => b.id - a.id); // Newest posts first

    return { posts: entries };
}
