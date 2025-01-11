<script lang="ts">
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import { Switch } from "@skeletonlabs/skeleton-svelte";

    import Sun from "~icons/mdi/weather-sunny";
    import Moon from "~icons/mdi/weather-night";
    import Github from "~icons/mdi/github";
    import Linkedin from "~icons/mdi/linkedin";
    import Email from "~icons/mdi/email";

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

<header class="bg-surface-200 dark:bg-surface-900">
    <div class="container mx-auto flex flex-col items-center py-2 lg:flex-row lg:justify-between">
        <div class="flex grow items-center">
            <a href="{base}/"><img src="{base}/images/Hex.png" width="75" height="75" alt="Logo" /></a>
            <h4 class="h4 pl-3"><a href="{base}/">Albert Johannessen</a></h4>
        </div>

        <nav class="flex">
            {#each links as link}
                <a href={link.url} class="btn-lg px-2">{link.label}</a>
            {/each}
        </nav>

        <div class="flex gap-2 lg:gap-1 lg:pl-5">
            <Switch
                name="mode"
                controlActive="bg-surface-300"
                controlInactive="bg-surface-500"
                bind:checked={darkModeState}
                onCheckedChange={handleDarkModeStateChange}
            >
                {#snippet inactiveChild()}<Moon width="24" height="24" />{/snippet}
                {#snippet activeChild()}<Sun width="24" height="24" />{/snippet}
            </Switch>
            <a href="https://github.com/aljhn"><Github width="32" height="32" /></a>
            <a href="https://www.linkedin.com/in/albertjohannessen/"><Linkedin width="32" height="32" /></a>
            <a href="mailto:albert.johannessen@gmail.com"><Email width="32" height="32" /></a>
        </div>
    </div>
</header>
