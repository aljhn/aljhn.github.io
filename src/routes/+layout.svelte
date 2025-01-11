<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="grid h-screen w-screen grid-rows-[auto_1fr]">
    <Header />

    <div class="bg-surface-100 dark:bg-surface-800" id="mainRoot">
        <main class="container mx-auto h-full">
            {@render children()}
        </main>
    </div>
</div>
