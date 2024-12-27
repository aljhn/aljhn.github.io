<script lang="ts">
    import { AppBar } from "@skeletonlabs/skeleton-svelte";
    import { base } from "$app/paths";

    const links = [
        { url: "/", label: "Home" },
        { url: "/about", label: "About" },
        { url: "/publications", label: "Publications" },
        { url: "/interests", label: "Interests" },
        { url: "/tech", label: "Tech Stack" }
    ];
</script>

<header class="flex w-full flex-col">
    <section class="mx-auto flex w-4/5 justify-center">
        <div class="p-4">
            <a href="/"><img src="images/Hex.png" width="75" height="75" alt="Logo" /></a>
        </div>
        <div class="grow content-center text-left">
            <a href="/"><h3 class="h3">Albert Johannessen</h3></a>
        </div>
        <!-- <nav class="content-center gap-2"> -->
        <!--     {#each links as link} -->
        <!--         <a href={base}{link.url} class="btn-lg">{link.label}</a> -->
        <!--     {/each} -->
        <!-- </nav> -->
    </section>
</header>
