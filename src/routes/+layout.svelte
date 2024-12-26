<script lang="ts">
    import "../app.css";
    let { children } = $props();
</script>

<header>
    <h1>Albert Johannessen</h1>
</header>

<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>

<main>
    {@render children()}
</main>

<footer>Footer</footer>
