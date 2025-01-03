<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr]">
    <Header />

    <div class="flex w-full h-full bg-surface-100 dark:bg-surface-800">
        <div class="container mx-auto">
            <main class="flex w-full h-full">
                {@render children()}
            </main>
        </div>
    </div>
</div>
