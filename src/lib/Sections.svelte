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

<div class="grid auto-rows-min gap-5 p-10">
    {#each sections as section}
        <section>
            <h2 class="font-mono text-2xl font-semibold">{section.title}</h2>
            {#each section.paragraphs as paragraph}
                <p class="pt-4">{paragraph}</p>
            {/each}
        </section>
    {/each}
</div>
