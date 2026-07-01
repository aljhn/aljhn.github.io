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

<div class="grid auto-rows-min gap-5">
    {#each sections as section (section.title)}
        <section>
            <h2 class="text-textlight-1 dark:text-textdark-1 darkModeFade font-mono text-2xl font-semibold">
                {section.title}
            </h2>
            {#each section.paragraphs as paragraph, i (i)}
                <p class="text-textlight-2 dark:text-textdark-2 darkModeFade pt-4">{paragraph}</p>
            {/each}
        </section>
    {/each}
</div>
