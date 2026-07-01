<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";
    import { onNavigate } from "$app/navigation";

    let { children } = $props();

    onNavigate(() => {
        if (!document.startViewTransition) {
            return;
        }
        return new Promise((resolve) => {
            document.startViewTransition(() => resolve());
        });
    });
</script>

<div class="flex min-h-screen flex-col font-sans">
    <Header />

    <div
        class="bg-bglight-1 dark:bg-bgdark-1 darkModeFade flex flex-1 flex-col text-gray-600 dark:text-gray-300"
        id="mainRoot"
    >
        <main class="flex flex-1 flex-col">
            {@render children()}
        </main>
    </div>
</div>
