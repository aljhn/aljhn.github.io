<script lang="ts">
    interface Figure {
        src: string | { img: { src: string; w: number; h: number }; sources: Record<string, string> };
        alt: string;
        caption: string;
    }

    const { src, alt, caption }: Figure = $props();
</script>

<figure class="my-5 flex flex-col items-center">
    <enhanced:img {src} {alt} class="rounded-md shadow-lg" />
    <figcaption class="mt-2 text-sm text-textlight-2 dark:text-textdark-2 darkModeFade">{caption}</figcaption>
</figure>
