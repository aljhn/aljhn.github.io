<script lang="ts">
    import Meta from "$lib/Meta.svelte";
    import { resolve } from "$app/paths";

    let { data } = $props();
</script>

<Meta title="Posts" />

<div class="mx-auto w-full max-w-5xl px-5 pt-10 pb-20">
    <div class="grid auto-rows-min gap-6">
        <p class="text-textlight-2 dark:text-textdark-2 darkModeFade">Sorted newest to oldest.</p>
        {#each data.posts as post (post.id)}
            <a
                href={resolve(`/posts/${post.slug}`)}
                class="bg-bglight-2 dark:bg-bgdark-2 darkModeFade rounded-xl shadow-xl flex"
            >
                <div class="bg-bglight-3 dark:bg-bgdark-3 darkModeFade rounded-xl shadow-xl flex items-center justify-center px-10">
                    <p class="text-textlight-1 dark:text-textdark-1 darkModeFade text-xl font-semibold">{post.id}</p>
                </div>
                <div class="px-5 py-5">
                    <h2 class="text-textlight-1 dark:text-textdark-1 darkModeFade text-xl font-semibold">
                        {post.metadata?.title ?? post.slug}
                    </h2>
                    {#if post.metadata?.description}
                        <p class="text-textlight-2 dark:text-textdark-2 darkModeFade pt-1">
                            {post.metadata.description}
                        </p>
                    {/if}
                </div>
            </a>
        {/each}
    </div>
</div>
