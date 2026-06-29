<script>
    let { data } = $props();

    let Post = $derived(data.component);
</script>

<a href="/writing" class="text-linklight dark:text-linkdark text-lg hover:underline">Go back</a>

<article class="prose dark:prose-invert">
    <Post />
</article>
