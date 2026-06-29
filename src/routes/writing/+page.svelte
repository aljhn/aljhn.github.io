<script>
    import Meta from "$lib/Meta.svelte";

    let { data } = $props();
</script>

<Meta name="Writing" />

<h1>Writing</h1>

<ul>
    {#each data.posts as post}
        <li>
            <a href={`/writing/${post.slug}`}>
                {post.metadata?.title ?? post.slug}
            </a>
        </li>
    {/each}
</ul>
