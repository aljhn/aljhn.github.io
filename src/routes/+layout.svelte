<script lang="ts">
    import "../app.css";

    let { children } = $props();

    import { base } from "$app/paths";

    const links = [
        { url: base + "/", label: "Home" },
        { url: base + "/about", label: "About" },
        { url: base + "/publications", label: "Publications" },
        { url: base + "/interests", label: "Interests" },
        { url: base + "/tech", label: "Tech Stack" }
    ];
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
    <header class="flex w-full">
        <section class="mx-auto flex w-8/12">
            <div class="p-4">
                <a href="{base}/"><img src="images/Hex.png" width="75" height="75" alt="Logo" /></a>
            </div>
            <div class="grow content-center text-left">
                <a href="{base}/"><h3 class="h3">Albert Johannessen</h3></a>
            </div>
            <nav class="content-center gap-2">
                {#each links as link}
                    <a href={link.url} class="btn-lg">{link.label}</a>
                {/each}
            </nav>
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
