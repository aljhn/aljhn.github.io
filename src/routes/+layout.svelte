<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
    <Header />

    <div class="grid grid-cols-1 grid-cols-[1fr_3fr_1fr]">
        <aside class="bg-yellow-500"></aside>
        <main class="bg-green-500">
            {@render children()}
        </main>
        <aside class="bg-yellow-500"></aside>
    </div>

    <footer class="flex w-full p-4"></footer>
</div>
