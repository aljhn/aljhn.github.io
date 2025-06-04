<script lang="ts">
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import { page } from "$app/state";

    // https://icon-sets.iconify.design/lucide/
    import Sun from "~icons/lucide/sun";
    import Moon from "~icons/lucide/moon";
    import Github from "~icons/lucide/github";
    import Linkedin from "~icons/lucide/linkedin";
    import Email from "~icons/lucide/mail";
    import Academic from "~icons/lucide/graduation-cap";
    import Menu from "~icons/lucide/menu";

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

<header class="bg-neutral-300 font-mono text-gray-800 dark:bg-neutral-900 dark:text-gray-300">
    <div class="container mx-auto flex flex-col items-center py-2 lg:flex-row lg:justify-between">
        <div class="flex grow items-center">
            <a href="{base}/"><enhanced:img src="/static/images/Hex.png?w=150" alt="Logo" width="75" height="75" /></a>
            <a href="{base}/"><h1 class="px-2 text-2xl font-bold lg:text-3xl">Albert Johannessen</h1></a>

            <button
                bind:this={dropdownMenuButton}
                class="{isDropdownOpen ? 'bg-neutral-400 dark:bg-neutral-950' : ''} inline p-1 lg:hidden"
                onclick={handleDropdownClick}
                onfocusout={handleDropdownFocusLoss}
                aria-label="Navigation menu"
            >
                <Menu width="32" height="32" />
                <div
                    bind:this={dropdownMenuDiv}
                    class="absolute left-0 z-10 bg-neutral-300 shadow-lg dark:bg-neutral-800"
                    style:visibility={isDropdownOpen ? "visible" : "collapse"}
                >
                    <div class="flex flex-col items-center space-y-1 p-2">
                        {#each links as link}
                            <a
                                href={link.url}
                                class="{page.url.pathname === link.url
                                    ? 'font-extrabold'
                                    : 'font-medium'} hover:underline">{link.label}</a
                            >
                        {/each}

                        <a href="https://github.com/aljhn" aria-label="GitHub profile"
                            ><Github width="32" height="32" alt="GitHub" /></a
                        >
                        <a href="https://www.linkedin.com/in/albertjohannessen/" aria-label="LinkedIn profile"
                            ><Linkedin width="32" height="32" alt="LinkedIn" /></a
                        >
                        <a
                            href="https://scholar.google.com/citations?user=Bo5FC8YAAAAJ"
                            aria-label="Google Scholar profile"
                            ><Academic width="32" height="32" alt="Google Scholar" /></a
                        >
                        <a href="mailto:albert.johannessen@gmail.com" aria-label="Email"
                            ><Email width="32" height="32" alt="Email" /></a
                        >
                    </div>
                </div>
            </button>
        </div>

        <nav class="hidden lg:flex">
            {#each links as link}
                <a
                    href={link.url}
                    class="p-1 text-lg {page.url.pathname === link.url
                        ? 'font-extrabold'
                        : 'font-medium'} hover:underline">{link.label}</a
                >
            {/each}
        </nav>

        <button><Sun width="32" height="32" /></button>

        <div class="hidden lg:flex lg:gap-1 lg:pl-5">
            <a href="https://github.com/aljhn" aria-label="GitHub profile"
                ><Github width="32" height="32" alt="GitHub" /></a
            >
            <a href="https://www.linkedin.com/in/albertjohannessen/" aria-label="LinkedIn profile"
                ><Linkedin width="32" height="32" alt="LinkedIn" /></a
            >
            <a href="https://scholar.google.com/citations?user=Bo5FC8YAAAAJ" aria-label="Google Scholar profile"
                ><Academic width="32" height="32" alt="Google Scholar" /></a
            >
            <a href="mailto:albert.johannessen@gmail.com" aria-label="Email"
                ><Email width="32" height="32" alt="Email" /></a
            >
        </div>
    </div>
</header>
