<script>
  let { data } = $props();

  let Post = $derived(data.component);
  let metadata = $derived(data.metadata);
</script>

<article>
  <h1>{metadata?.title}</h1>

  <Post />
</article>
