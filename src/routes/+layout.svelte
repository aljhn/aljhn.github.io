<script lang="ts">
    import "../app.css";
    let { children } = $props();
</script>

<ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
</ul>

{@render children()}
