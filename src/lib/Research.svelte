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
    <h2 class="my-2 border-b-2 border-current font-mono text-2xl font-semibold">{title}</h2>
    <ul class="space-y-4">
        {#each papers as paper}
            <li class="rounded-xl bg-neutral-100 p-3 shadow-xl dark:bg-neutral-900">
                <h3 class="text-xl font-semibold hover:underline">
                    <a href={paper.link}>{paper.title}</a>
                </h3>
                <div class="flex">
                    <p class="text-lg">{paper.authors}</p>
                    <p class="text-md grow text-right">{paper.year}</p>
                </div>
                <p class="text-sm">{paper.conference}</p>
            </li>
        {/each}
    </ul>
</div>
