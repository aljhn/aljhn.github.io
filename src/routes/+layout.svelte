<script lang="ts">
    import "../app.css";
    import Header from "$lib/Header.svelte";
    import { page } from "$app/state";
    import { base } from "$app/paths";

    let { children } = $props();

    const pathName = page.url.pathname;
    const pageName = pathName.substring(pathName.indexOf(base), -1);

    const meta = {
        author: "Albert Johannessen",
        title:
            "Albert Johannessen" +
            (pageName === "/" ? "" : " - " + (pageName.charAt(1).toUpperCase() + pageName.slice(2))),
        description: "Personal website. Resume, portfolio and interests.",
        keywords:
            "Personal Website, Resume, Portfolio, Projects, Publications, Interests, Computer Science, Programming, Artificial Intelligence, AI, Machine Learning, Deep Learning, Math, Dynamical Systems, Control Theory",
        url: "https://aljhn.github.io/",
        image: "https://aljhn.github.io/images/Hex.png"
    };
</script>

<svelte:head>
    <title>{meta.title}</title>

    <meta name="title" content={meta.title} />
    <meta name="description" content={meta.description} />
    <meta name="keywords" content={meta.keywords} />
    <meta name="author" content={meta.author} />
    <meta name="temp1" content={pathName} />
    <meta name="temp2" content={pageName} />
    <meta name="temp3" content={base} />

    <meta property="og:site_name" content="aljhn.github.io" />
    <meta property="og:title" content={meta.title} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={meta.url} />
    <meta property="og:image" content={meta.image} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@aljhnssnn" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={meta.image} />
    <meta name="twitter:url" content={meta.url} />
    <meta name="twitter:creator" content="@aljhnssnn" />
</svelte:head>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
    <Header />

    <div class="grid grid-cols-1 md:grid-cols-[auto_1fr_auto]">
        <aside class="bg-yellow-500 p-4 pr-20"></aside>
        <main class="space-y-4 bg-green-500 p-4">
            {@render children()}
        </main>
        <aside class="bg-yellow-500 pl-20"></aside>
    </div>
    <footer class="bg-blue-500 p-4"></footer>
</div>
