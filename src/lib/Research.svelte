<script lang="ts">
    interface Paper {
        title: string;
        authors: string;
        conference: string;
        year: number;
        link: string;
    }

    interface Papers {
        papers: Array<Paper>;
        title: string;
    }

    const { papers, title }: Papers = $props();
</script>

<div class="mx-auto px-10 pt-10">
    <h2 class="my-2 border-b-2 border-current font-mono text-2xl font-semibold text-textlight-1 dark:text-textdark-1">{title}</h2>
    <ul class="space-y-4">
        {#each papers as paper}
            <li class="rounded-xl bg-bglight-2 p-3 shadow-xl dark:bg-bgdark-2 text-textlight-2 dark:text-textdark-2">
                <h3 class="text-xl font-semibold hover:underline text-textlight-1 dark:text-textdark-1">
                    <a href={paper.link}>{paper.title}</a>
                </h3>
                <div class="flex">
                    <p class="text-lg">{paper.authors}</p>
                    <p class="text-md grow text-right">{paper.year}</p>
                </div>
                <p class="text-sm italic">{paper.conference}</p>
            </li>
        {/each}
    </ul>
</div>
