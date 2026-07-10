<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    let { data } = $props();
</script>

<Meta title="Writing" />

<div class="mx-auto w-full max-w-5xl px-5 pt-10 pb-20">
    <div class="grid auto-rows-min gap-6">
        <p class="text-textlight-2 dark:text-textdark-2 darkModeFade">Sorted newest to oldest.</p>
        {#each data.posts as post (post.id)}
            <a
                href={`/writing/${post.slug}`}
                class="bg-bglight-2 dark:bg-bgdark-2 darkModeFade block rounded-xl p-6 shadow-xl"
            >
                <h2 class="text-textlight-1 dark:text-textdark-1 darkModeFade text-xl font-semibold">
                    {post.metadata?.title ?? post.slug}
                </h2>
                {#if post.metadata?.description}
                    <p class="text-textlight-2 dark:text-textdark-2 darkModeFade pt-1">{post.metadata.description}</p>
                {/if}
            </a>
        {/each}
    </div>
</div>
