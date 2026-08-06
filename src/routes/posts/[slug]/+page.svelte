<script lang="ts">
    import Meta from "$lib/Meta.svelte";
    import { resolve } from "$app/paths";

    let { data } = $props();

    let Post = $derived(data.component);
    let { title, description, date } = $derived(data.metadata);
</script>

<Meta {title} {description} {date} type="article" />

<div class="mx-auto w-full max-w-5xl pt-5 pb-20">
    <a
        href={resolve("/posts")}
        class="text-linklight dark:text-linkdark text-lg font-semibold underline px-10"
        aria-label="Back to Posts"
    >
        &larr; Back
    </a>

    <article class="prose dark:prose-invert pt-10 px-5 mx-auto w-full max-w-5xl text-textlight-2 dark:text-textdark-2">
        <h1 class="text-center text-textlight-1 dark:text-textdark-1">{title}</h1>
        <h2 class="text-center text-textlight-1 dark:text-textdark-1 pb-10">{description}</h2>

        <Post />
    </article>
</div>
