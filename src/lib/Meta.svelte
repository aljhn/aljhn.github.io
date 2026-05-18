<script lang="ts">
    let { name } = $props();

    const meta = $derived.by(() => {
        const pageTitle = name === "Home" ? "" : " - " + (name.charAt(0).toUpperCase() + name.slice(1));
        const pageUrl = name === "Home" ? "" : "/" + name.charAt(0).toLowerCase() + name.slice(1);

        return {
            author: "Albert Johannessen",
            title: "Albert Johannessen" + pageTitle,
            description: "Personal website" + pageTitle,
            keywords:
                "Personal Website, Resume, Portfolio, Projects, Publications, Interests, Computer Science, Programming, Artificial Intelligence, AI, Machine Learning, Deep Learning, Math, Dynamical Systems, Control Theory",
            url: "https://aljhn.github.io",
            pageUrl: "https://aljhn.github.io" + pageUrl,
            image: "https://aljhn.github.io/images/Hex.png"
        };
    });
</script>

<svelte:head>
    <title>{meta.title}</title>

    <link rel="canonical" href={meta.pageUrl} />

    <meta name="title" content={meta.title} />
    <meta name="description" content={meta.description} />
    <meta name="keywords" content={meta.keywords} />
    <meta name="author" content={meta.author} />

    <meta property="og:site_name" content="aljhn.github.io" />
    <meta property="og:title" content={meta.title} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={meta.url} />
    <meta property="og:image" content={meta.image} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={meta.image} />
    <meta name="twitter:url" content={meta.url} />
</svelte:head>
