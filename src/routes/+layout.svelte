<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";

    let { children } = $props();
</script>

<div class="flex min-h-screen flex-col font-sans">
    <Header />

    <div class="bg-bglight-1 dark:bg-bgdark-1 flex flex-1 flex-col text-gray-600 dark:text-gray-300" id="mainRoot">
        <main class="mx-auto flex w-full flex-1 flex-col px-0 pb-10 lg:px-20">
            {@render children()}
        </main>
    </div>
</div>
