<script lang="ts">
    import "../app.css";
    import { base } from "$app/paths";
    import { Switch } from "@skeletonlabs/skeleton-svelte";
    import { onMount } from "svelte";

    import Sun from "~icons/mdi/weather-sunny";
    import Moon from "~icons/mdi/weather-night";
    import Github from "~icons/mdi/github";
    import Linkedin from "~icons/mdi/linkedin";

    let { children } = $props();

    const links = [
        { url: base + "/", label: "Home" },
        { url: base + "/about", label: "About" },
        { url: base + "/skills", label: "Skills" },
        { url: base + "/publications", label: "Publications" }
    ];

    let darkModeState = $state(false);

    onMount(() => {
        darkModeState = !window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", !darkModeState);
    });

    function handleDarkModeStateChange() {
        darkModeState = !darkModeState;
        document.documentElement.classList.toggle("dark", !darkModeState);
    }
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
    <header class="flex w-full">
        <section class="mx-auto flex w-9/12">
            <div class="p-4">
                <a href="{base}/"><img src="{base}/images/Hex.png" width="75" height="75" alt="Logo" /></a>
            </div>
            <div class="grow content-center text-left">
                <a href="{base}/"><h3 class="h3">Albert Johannessen</h3></a>
            </div>
            <nav class="content-center gap-2">
                {#each links as link}
                    <a href={link.url} class="btn-lg">{link.label}</a>
                {/each}
            </nav>
            <div class="ml-10 flex items-center gap-2">
                <Switch
                    name="mode"
                    controlActive="bg-surface-200"
                    bind:checked={darkModeState}
                    onCheckedChange={handleDarkModeStateChange}
                >
                    {#snippet inactiveChild()}<Moon width="18" height="18" />{/snippet}
                    {#snippet activeChild()}<Sun width="18" height="18" />{/snippet}
                </Switch>
                <a href="https://github.com/aljhn"><Github width="24" height="24" /></a>
                <a href="https://www.linkedin.com/in/albertjohannessen/"><Linkedin width="24" height="24" /></a>
            </div>
        </section>
    </header>

    <div class="grid grid-cols-1 grid-cols-[1fr_3fr_1fr]">
        <aside class="bg-yellow-500"></aside>
        <main class="bg-green-500">
            {@render children()}
        </main>
        <aside class="bg-yellow-500"></aside>
    </div>

    <footer class="flex w-full p-4"></footer>
</div>
