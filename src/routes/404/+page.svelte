<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    const pages = [
        { url: "/", label: "Home" },
        { url: "/about", label: "About" },
        { url: "/skills", label: "Skills" },
        { url: "/research", label: "Research" },
        { url: "/writing", label: "Writing" },
        { url: "/quotes", label: "Quotes" }
    ];
</script>

<Meta title="404" />

<div class="mx-auto flex max-w-lg flex-col items-center px-5 pt-20 text-center">
    <h1 class="text-textlight-1 dark:text-textdark-1 darkModeFade font-mono text-5xl font-bold">404</h1>
    <p class="text-textlight-2 dark:text-textdark-2 darkModeFade pt-2 text-xl">Page not found</p>
    <p class="text-textlight-2 dark:text-textdark-2 darkModeFade pt-4">
        The page you're looking for doesn't exist or has been moved.
    </p>

    <div class="mt-8 grid w-full grid-cols-2 gap-3">
        {#each pages as page (page.url)}
            <a
                href={page.url}
                class="bg-bglight-2 dark:bg-bgdark-2 darkModeFade rounded-xl p-3 font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
                {page.label}
            </a>
        {/each}
    </div>
</div>
