<script lang="ts">
    interface Paper {
        title: string;
        authors: string;
        conference: string;
        year: number;
        link: string;
        pdf: string;
    }

    interface Papers {
        papers: Array<Paper>;
        title: string;
    }

    const { papers, title }: Papers = $props();
</script>

<div class="px-5 pt-10 lg:px-10">
    <h2
        class="text-textlight-1 dark:text-textdark-1 darkModeFade my-2 border-b-2 border-current font-mono text-2xl font-semibold"
    >
        {title}
    </h2>
    <ul class="space-y-4">
        {#each papers as paper (paper.title)}
            <li
                class="bg-bglight-2 dark:bg-bgdark-2 text-textlight-2 dark:text-textdark-2 darkModeFade rounded-xl p-3 shadow-xl"
            >
                <h3 class="text-textlight-1 dark:text-textdark-1 darkModeFade text-xl font-semibold">{paper.title}</h3>
                <div class="flex">
                    {#if paper.pdf != ""}
                        <a class="mr-3 text-lg hover:underline text-linklight dark:text-linkdark" href={paper.pdf}>[PDF]</a>
                    {/if}
                    {#if paper.link != ""}
                        <a class="text-lg hover:underline text-linklight dark:text-linkdark" href={paper.link}>[Link]</a>
                    {/if}
                    <p class="text-md grow text-right">{paper.year}</p>
                </div>
                <p class="text-sm italic">{paper.conference}</p>
            </li>
        {/each}
    </ul>
</div>
