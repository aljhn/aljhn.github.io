<script lang="ts">
    import { base } from "$app/paths";

    import "../app.css";
    let { children } = $props();
</script>

<header>
    <h1>Albert Johannessen</h1>
</header>

<nav>
    <a href="{base}/">Home</a>
    <a href="{base}/about">About</a>
</nav>

<main>
    {@render children()}
</main>

<footer>Footer</footer>
