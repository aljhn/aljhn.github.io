<script lang="ts">
    import { AppBar } from "@skeletonlabs/skeleton-svelte";
    import { base } from "$app/paths";

    const links = [
        { url: base + "/", label: "Home" },
        { url: base + "/about", label: "About" },
        { url: base + "/publications", label: "Publications" },
        { url: base + "/interests", label: "Interests" },
        { url: base + "/tech", label: "Tech Stack" }
    ];
</script>

<header class="flex w-full flex-col">
    <section class="mx-auto flex w-4/5 justify-center">
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
