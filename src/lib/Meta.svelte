<script lang="ts">
    import { page } from "$app/state";

    let {
        title,
        description,
        date,
        type = "website"
    }: {
        title: string;
        description?: string;
        date?: string;
        type?: string;
    } = $props();

    const data = {
        name: "Albert Johannessen",
        url: "https://aljhn.github.io",
        desc: "Personal website",
        image: "https://aljhn.github.io/images/Logo.png"
    };

    const meta = $derived.by(() => {
        const pageTitle = title === "Home" ? "" : " - " + (title.charAt(0).toUpperCase() + title.slice(1));

        return {
            author: data.name,
            title: data.name + pageTitle,
            description: description ?? data.desc + pageTitle,
            url: data.url,
            pageUrl: data.url + page.url.pathname,
            image: data.image
        };
    });

    const breadcrumbs = $derived.by(() => {
        const parts = page.url.pathname.split("/").filter(Boolean);
        const items = [{ "@type": "ListItem", position: 1, name: "Home", item: data.url + "/" }];
        let currentPath = "";
        for (let i = 0; i < parts.length; i++) {
            currentPath += "/" + parts[i];
            items.push({
                "@type": "ListItem",
                position: i + 2,
                name: parts[i].charAt(0).toUpperCase() + parts[i].slice(1),
                item: data.url + currentPath
            });
        }
        return items;
    });

    const articleSchema = $derived(
        type === "article"
            ? [
                  {
                      "@type": "Article",
                      headline: meta.title,
                      author: { "@type": "Person", name: data.name },
                      datePublished: date ?? new Date().toISOString().split("T")[0],
                      image: meta.image,
                      url: meta.pageUrl,
                      description: meta.description,
                      publisher: { "@type": "Person", name: data.name }
                  }
              ]
            : []
    );

    const jsonld = $derived({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                name: data.name,
                url: data.url,
                description: data.desc
            },
            {
                "@type": "Person",
                name: data.name,
                url: data.url,
                image: data.image,
                sameAs: [
                    "https://github.com/aljhn",
                    "https://www.linkedin.com/in/albertjohannessen/",
                    "https://scholar.google.com/citations?user=Bo5FC8YAAAAJ"
                ],
                jobTitle: "Software Engineer",
                description: "Software engineer, specializing in machine learning and control theory."
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: breadcrumbs
            },
            ...articleSchema
        ]
    });

    const jsonldString: string = $derived.by(() => JSON.stringify(jsonld));
</script>

<svelte:head>
    <title>{meta.title}</title>

    <link rel="canonical" href={meta.pageUrl} />

    <meta name="title" content={meta.title} />
    <meta name="description" content={meta.description} />
    <meta name="author" content={meta.author} />

    <meta property="og:site_name" content={data.url} />
    <meta property="og:title" content={meta.title} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={meta.pageUrl} />
    <meta property="og:image" content={meta.image} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={meta.image} />
    <meta name="twitter:url" content={meta.pageUrl} />

    {#if type === "article" && date !== undefined}
        <meta property="article:published_time" content={date} />
        <meta property="article:author" content={data.name} />
    {/if}

    {@html `<script type="application/ld+json">${jsonldString}</script>`}
</svelte:head>
