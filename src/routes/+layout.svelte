<script lang="ts">
    import "../app.css";
    let { children } = $props();
</script>

<header>
    <h1>Albert Johannessen</h1>
</header>

<nav>
</nav>

<main>
    {@render children()}
</main>

<footer>Footer</footer>
