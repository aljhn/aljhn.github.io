<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="max-w-screen grid min-h-screen grid-rows-[auto_1fr]">
    <Header />

    <div class="bg-surface-100 dark:bg-surface-800" id="mainRoot">
        <main class="container mx-auto h-full pb-10">
            {@render children()}
        </main>
    </div>
</div>
