<script lang="ts">
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import { page } from "$app/state";

    import { Switch } from "@skeletonlabs/skeleton-svelte";

    // https://icon-sets.iconify.design/mdi/
    import Sun from "~icons/mdi/weather-sunny";
    import Moon from "~icons/mdi/weather-night";
    import Github from "~icons/mdi/github";
    import Linkedin from "~icons/mdi/linkedin";
    import Email from "~icons/mdi/email";
    import Academic from "~icons/mdi/academic-cap";
    import Menu from "~icons/mdi/menu";

    const links = [
        { url: base + "/", label: "Home" },
        { url: base + "/about", label: "About" },
        { url: base + "/quotes", label: "Quotes" },
        { url: base + "/skills", label: "Skills" },
        { url: base + "/research", label: "Research" }
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

    function handleDarkModeStateChangePhone() {
        darkModeState = !darkModeState;
        document.documentElement.classList.toggle("dark", !darkModeState);
        isDropdownOpen = true;
    }

    let isDropdownOpen = $state(false);

    let dropdownMenuButton: HTMLElement;
    let dropdownMenuDiv: HTMLElement;

    const handleDropdownClick = () => {
        isDropdownOpen = !isDropdownOpen;
        if (isDropdownOpen && dropdownMenuButton && dropdownMenuDiv) {
            const positionLeftUnderButton: number = Math.floor(
                (dropdownMenuButton.getClientRects()[0].x + dropdownMenuButton.getClientRects()[0].right) / 2 -
                    dropdownMenuDiv.clientWidth / 2
            );
            const positionLeftEndOfScreen: number = Math.floor(
                document.querySelector("header")!.clientWidth - dropdownMenuDiv.clientWidth
            );
            dropdownMenuDiv.style.left = Math.min(positionLeftUnderButton, positionLeftEndOfScreen).toString() + "px";
            dropdownMenuDiv.style.top = Math.floor(dropdownMenuButton.getClientRects()[0].bottom).toString() + "px";
        }
    };

    const handleDropdownFocusLoss = (event: FocusEvent) => {
        if (!event.relatedTarget || !(event.target as HTMLElement).contains(event.relatedTarget as HTMLElement)) {
            isDropdownOpen = false;
        }
    };
</script>

<header class="bg-surface-200 dark:bg-surface-900">
    <div class="container mx-auto flex flex-col items-center py-2 lg:flex-row lg:justify-between">
        <div class="flex grow items-center">
            <a href="{base}/"><img src="{base}/images/Hex.png" width="75" height="75" alt="Logo" /></a>
            <h4 class="h5 px-2 lg:h4"><a href="{base}/">Albert Johannessen</a></h4>

            <button
                bind:this={dropdownMenuButton}
                class="{isDropdownOpen ? 'bg-surface-300 dark:bg-surface-700' : ''} p-1 inline lg:hidden"
                onclick={handleDropdownClick}
                onfocusout={handleDropdownFocusLoss}
            >
                <Menu width="32" height="32" />
                <div
                    bind:this={dropdownMenuDiv}
                    class="absolute left-0 z-10 bg-surface-300 shadow-xl dark:bg-surface-700"
                    style:visibility={isDropdownOpen ? "visible" : "collapse"}
                >
                    <div class="space-y-1 flex flex-col items-center p-2">
                        {#each links as link}
                            <a
                                href={link.url}
                                class="{page.url.pathname === link.url ? 'font-extrabold' : ''} hover:underline"
                                >{link.label}</a
                            >
                        {/each}

                        <Switch
                            name="mode"
                            controlActive="bg-surface-400"
                            controlInactive="bg-surface-500"
                            bind:checked={darkModeState}
                            onCheckedChange={handleDarkModeStateChangePhone}
                        >
                            {#snippet inactiveChild()}<Moon width="24" height="24" />{/snippet}
                            {#snippet activeChild()}<Sun width="24" height="24" />{/snippet}
                        </Switch>
                        <a href="https://github.com/aljhn"><Github width="32" height="32" /></a>
                        <a href="https://www.linkedin.com/in/albertjohannessen/"><Linkedin width="32" height="32" /></a>
                        <a href="https://scholar.google.com/citations?user=Bo5FC8YAAAAJ"><Academic width="32" height="32" /></a>
                        <a href="mailto:albert.johannessen@gmail.com"><Email width="32" height="32" /></a>
                    </div>
                </div>
            </button>
        </div>

        <nav class="hidden lg:flex">
            {#each links as link}
                <a href={link.url} class="p-1 {page.url.pathname === link.url ? 'font-extrabold' : ''} hover:underline"
                    >{link.label}</a
                >
            {/each}
        </nav>

        <div class="hidden lg:flex lg:gap-1 lg:pl-5">
            <Switch
                name="mode"
                controlActive="bg-surface-400"
                controlInactive="bg-surface-500"
                bind:checked={darkModeState}
                onCheckedChange={handleDarkModeStateChange}
            >
                {#snippet inactiveChild()}<Moon width="24" height="24" />{/snippet}
                {#snippet activeChild()}<Sun width="24" height="24" />{/snippet}
            </Switch>
            <a href="https://github.com/aljhn"><Github width="32" height="32" /></a>
            <a href="https://www.linkedin.com/in/albertjohannessen/"><Linkedin width="32" height="32" /></a>
            <a href="https://scholar.google.com/citations?user=Bo5FC8YAAAAJ"><Academic width="32" height="32" /></a>
            <a href="mailto:albert.johannessen@gmail.com"><Email width="32" height="32" /></a>
        </div>
    </div>
</header>
