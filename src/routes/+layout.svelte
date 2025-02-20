<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="grid min-h-screen max-w-screen grid-rows-[auto_1fr]">
    <Header />

    <div class="bg-surface-100 dark:bg-surface-800" id="mainRoot">
        <main class="container mx-auto h-full pb-10">
            {@render children()}
        </main>
    </div>
</div>
