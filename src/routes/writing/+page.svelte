<script>
    import Meta from "$lib/Meta.svelte";

    let { data } = $props();
</script>

<Meta title="Writing" />

<div class="mx-auto px-5 pt-20 pb-20">
    <ul class="items-left space-y-4">
        {#each data.posts as post}
            <li class="p-1">
                <a href={`/writing/${post.slug}`} class="font-bold hover:underline">
                    {post.metadata?.title ?? post.slug}
                </a>
            </li>
        {/each}
    </ul>
</div>
