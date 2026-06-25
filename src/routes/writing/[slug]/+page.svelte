<script>
  let { data } = $props();

  let Post = $derived(data.component);
  let metadata = $derived(data.metadata);
</script>

<article class="prose dark:prose-invert">
  <h1>{metadata?.title}</h1>

  <Post />
</article>
