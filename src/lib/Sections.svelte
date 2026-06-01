<script lang="ts">
    interface Section {
        title: string;
        paragraphs: Array<string>;
    }

    interface Sections {
        sections: Array<Section>;
    }

    const { sections }: Sections = $props();
</script>

<div class="grid auto-rows-min gap-5 px-5 lg:px-10">
    {#each sections as section}
        <section>
            <h2 class="text-textlight-1 dark:text-textdark-1 font-mono text-2xl font-semibold darkModeFade">{section.title}</h2>
            {#each section.paragraphs as paragraph}
                <p class="text-textlight-2 dark:text-textdark-2 pt-4 darkModeFade">{paragraph}</p>
            {/each}
        </section>
    {/each}
</div>
