<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="grid min-h-screen max-w-screen grid-rows-[auto_1fr] font-sans">
    <Header />

    <div class="bg-neutral-200 text-gray-600 dark:bg-neutral-800 dark:text-gray-300" id="mainRoot">
        <main class="container mx-auto h-full pb-10">
            {@render children()}
        </main>
    </div>
</div>
