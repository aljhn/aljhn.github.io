<script>
    let { data } = $props();

    let Post = $derived(data.component);
</script>


<div class="mx-auto pt-5 pb-20">
    <a href="/writing" class="text-lg font-bold hover:underline" aria-label="Back to writing index">Go back</a>

    <article class="prose dark:prose-invert pt-10">
        <Post />
    </article>
</div>
