interface Post {
    metadata: {
        title: string;
        description: string;
        date: string;
    };
}

const posts = import.meta.glob<Post>("$lib/posts/*.svx");

export async function load() {
    const entries = (
        await Promise.all(
            Object.entries(posts).map(async ([path, importer]) => {
                const post = await importer();
                const slug = path.split("/").at(-1)!.replace(".svx", "");
                const id = Number(slug.split("_").at(0));

                if (Number.isNaN(id)) {
                    return null;
                }

                return {
                    slug: slug,
                    metadata: post.metadata,
                    id: id
                };
            })
        )
    ).filter((entry) => { return entry !== null; });

    entries.sort((a, b) => b.id - a.id);

    return { posts: entries };
}
