import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

import remarkMath from "remark-math";
import rehypeKatexSvelte from "rehype-katex-svelte";

const mdsvexConfig = mdsvex({
    extensions: [".md", ".svx"],
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatexSvelte]
});

export default {
    extensions: [".svelte", ".md", ".svx"],

    preprocess: [mdsvexConfig, vitePreprocess()],

    kit: {
        adapter: adapter()
    }
};
