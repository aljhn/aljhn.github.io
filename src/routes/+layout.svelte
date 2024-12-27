<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
    <Header />

    <div class="grid grid-cols-1 md:grid-cols-[auto_1fr_auto]">
        <aside class="bg-yellow-500 p-4 pr-20"></aside>
        <main class="space-y-4 bg-green-500 p-4">
            {@render children()}
        </main>
        <aside class="bg-yellow-500 pl-20"></aside>
    </div>
    <footer class="bg-blue-500 p-4"></footer>
</div>
