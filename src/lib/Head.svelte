<script lang="ts">
    let { name } = $props();

    const meta = {
        author: "Albert Johannessen",
        title: "Albert Johannessen" + (name === "Home" ? "" : " - " + (name.charAt(0).toUpperCase() + name.slice(1))),
        description: "Personal website - " + name + ". Resume, portfolio and interests.",
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
