<script lang="ts">
    import { onMount } from "svelte";
    import { resolve } from "$app/paths";
    import { page } from "$app/state";

    // https://icon-sets.iconify.design/lucide/
    import Sun from "~icons/lucide/sun";
    import Moon from "~icons/lucide/moon";
    import Github from "~icons/lucide/github";
    import Linkedin from "~icons/lucide/linkedin";
    import Academic from "~icons/lucide/graduation-cap";
    import Menu from "~icons/lucide/menu";

    const links = [
        { url: resolve("/"), label: "Home" },
        { url: resolve("/about"), label: "About" },
        { url: resolve("/quotes"), label: "Quotes" },
        { url: resolve("/skills"), label: "Skills" },
        { url: resolve("/research"), label: "Research" },
        { url: resolve("/writing"), label: "Writing" }
    ];

    let darkModeState = $state(true);

    onMount(() => {
        const localStorageDarkMode: string | null = localStorage.getItem("darkMode");
        if (localStorageDarkMode !== null) {
            darkModeState = localStorageDarkMode === "true";
        } else {
            darkModeState = window.matchMedia("(prefers-color-scheme: dark)").matches;
        }

        document.documentElement.classList.toggle("dark", darkModeState);
    });

    function handleDarkModeToggle() {
        darkModeState = !darkModeState;
        localStorage.setItem("darkMode", darkModeState ? "true" : "false");
        document.documentElement.classList.toggle("dark", darkModeState);
    }

    function handleDarkModeToggleMenu() {
        handleDarkModeToggle();
        isDropdownOpen = false;
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

<header class="bg-bglight-2 text-textlight-1 dark:bg-bgdark-2 dark:text-textdark-1 darkModeFade font-mono">
    <div class="container mx-auto flex flex-col items-center py-2 lg:flex-row lg:justify-between">
        <div class="flex grow items-center">
            <a href={resolve("/")}><img src="images/Logo.svg" alt="Logo" width="75" height="75" /></a>
            <a href={resolve("/")}><h1 class="px-2 text-2xl font-bold lg:text-3xl">Albert Johannessen</h1></a>

            <button
                bind:this={dropdownMenuButton}
                class="{isDropdownOpen
                    ? 'bg-bglight-3 dark:bg-bgdark-3 shadow-lg'
                    : ''} darkModeFade inline p-1 lg:hidden"
                onclick={handleDropdownClick}
                onfocusout={handleDropdownFocusLoss}
                aria-label="Navigation menu"
            >
                <Menu width="32" height="32" />
                <div
                    bind:this={dropdownMenuDiv}
                    class="bg-bglight-3 dark:bg-bgdark-3 darkModeFade absolute left-0 z-10 shadow-lg"
                    style:visibility={isDropdownOpen ? "visible" : "collapse"}
                >
                    <div class="flex flex-col items-center space-y-1 p-2">
                        {#each links as link (link.url)}
                            <a
                                href={link.url}
                                class="{page.url.pathname === link.url
                                    ? 'font-extrabold'
                                    : 'font-medium'} hover:underline">{link.label}</a
                            >
                        {/each}

                        <div
                            onclick={handleDarkModeToggleMenu}
                            class="hover:bg-bglight-1 hover:dark:bg-bgdark-1 darkModeFade flex rounded-2xl p-1"
                            aria-hidden="true"
                        >
                            {#if darkModeState}
                                <Sun width="32" height="32" />
                            {:else}
                                <Moon width="32" height="32" />
                            {/if}
                        </div>

                        <a href="https://github.com/aljhn" aria-label="GitHub profile"
                            ><Github width="32" height="32" /></a
                        >
                        <a href="https://www.linkedin.com/in/albertjohannessen/" aria-label="LinkedIn profile"
                            ><Linkedin width="32" height="32" /></a
                        >
                        <a
                            href="https://scholar.google.com/citations?user=Bo5FC8YAAAAJ"
                            aria-label="Google Scholar profile"><Academic width="32" height="32" /></a
                        >
                    </div>
                </div>
            </button>
        </div>

        <nav class="hidden lg:flex lg:pr-3">
            {#each links as link (link.url)}
                <a
                    href={link.url}
                    class="p-1 text-lg {page.url.pathname === link.url
                        ? 'font-extrabold'
                        : 'font-medium'} hover:underline">{link.label}</a
                >
            {/each}
        </nav>

        <button
            onclick={handleDarkModeToggle}
            class="hover:bg-bglight-1 hover:dark:bg-bgdark-1 darkModeFade hidden rounded-2xl p-1 lg:flex"
            aria-label="Dark mode toggle"
        >
            {#if darkModeState}
                <Sun width="32" height="32" />
            {:else}
                <Moon width="32" height="32" />
            {/if}
        </button>

        <div class="hidden lg:flex lg:gap-1 lg:pl-3">
            <a href="https://github.com/aljhn" aria-label="GitHub profile"><Github width="32" height="32" /></a>
            <a href="https://www.linkedin.com/in/albertjohannessen/" aria-label="LinkedIn profile"
                ><Linkedin width="32" height="32" /></a
            >
            <a href="https://scholar.google.com/citations?user=Bo5FC8YAAAAJ" aria-label="Google Scholar profile"
                ><Academic width="32" height="32" /></a
            >
        </div>
    </div>
</header>
