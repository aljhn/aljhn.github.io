<script lang="ts">
    interface Figure {
        src: { img: { src: string; w: number; h: number }; sources: Record<string, string> };
        alt: string;
        caption: string;
    }

    const { src, alt, caption }: Figure = $props();
</script>

<figure class="my-5 flex flex-col items-center">
    <enhanced:img
        src={src}
        alt={alt}
        class="rounded-md shadow-lg"
        sizes={"1200px"}
    />
    <figcaption class="mt-3 px-20 text-sm text-textlight-2 dark:text-textdark-2 darkModeFade">{caption}</figcaption>
</figure>
