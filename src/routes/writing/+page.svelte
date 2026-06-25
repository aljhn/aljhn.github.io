<script>
  let { data } = $props();
</script>

<h1>Writing</h1>

<ul>
  {#each data.posts as post}
    <li>
      <a href={`/writing/${post.slug}`}>
        {post.metadata?.title ?? post.slug}
      </a>
    </li>
  {/each}
</ul>
