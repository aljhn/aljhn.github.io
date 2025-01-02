<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr]">
    <Header />

    <div class="grid grid-cols-[auto_1fr_auto] w-full bg-surface-800">
        <aside></aside>
        <main class="mx-auto flex w-8/12">
            {@render children()}
        </main>
        <aside></aside>
    </div>
</div>
