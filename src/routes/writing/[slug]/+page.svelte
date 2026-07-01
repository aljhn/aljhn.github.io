<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    let { data } = $props();

    let Post = $derived(data.component);
    let { title, description, date } = $derived(data.metadata);
</script>

<Meta {title} {description} {date} type="article" />

<div class="mx-auto max-w-3xl px-5 pt-5 pb-20">
    <a
        href="/writing"
        class="text-linklight dark:text-linkdark inline-flex items-center gap-1 text-lg font-semibold hover:underline"
        aria-label="Back to writing index"
    >
        &larr; Back
    </a>

    <article class="prose dark:prose-invert pt-8">
        <Post />
    </article>
</div>
