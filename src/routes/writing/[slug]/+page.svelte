<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    let { data } = $props();

    let Post = $derived(data.component);
    let { title, description, date } = $derived(data.metadata);
</script>

<Meta {title} {description} {date} type="article" />

<div class="mx-auto w-full max-w-4xl pt-5 pb-20">
    <a
        href="/writing"
        class="text-linklight dark:text-linkdark text-lg font-semibold hover:underline"
        aria-label="Back to Writing"
    >
        &larr; Back
    </a>

    <article class="prose dark:prose-invert pt-10 mx-auto w-full max-w-3xl">
        <h1 class="text-center">{title}</h1>
        <h2 class="text-center pb-10">{description}</h2>

        <Post />
    </article>
</div>
