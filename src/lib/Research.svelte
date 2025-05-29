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
    <h4 class="my-2 border-b-2 border-current text-2xl font-semibold">{title}</h4>
    <ul class="space-y-4">
        {#each papers as paper}
            <li class="bg-surface-200 dark:bg-surface-900 rounded-xl p-3 shadow-xl">
                <h3 class="text-xl font-semibold hover:underline">
                    <a href={paper.link}>{paper.title}</a>
                </h3>
                <div class="flex">
                    <p class="text-lg text-gray-600 dark:text-gray-400">{paper.authors}</p>
                    <p class="text-md grow text-right">{paper.year}</p>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{paper.conference}</p>
            </li>
        {/each}
    </ul>
</div>
