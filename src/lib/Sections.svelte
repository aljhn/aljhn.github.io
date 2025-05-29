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
            <p class="text-2xl font-semibold">{section.title}</p>
            {#each section.paragraphs as paragraph}
                <p class="pt-4 text-gray-600">{paragraph}</p>
            {/each}
        </section>
    {/each}
</div>
