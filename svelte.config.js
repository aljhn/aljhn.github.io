import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import remarkMath from "remark-math";
import rehypeKatexSvelte from "rehype-katex-svelte";
import { createHighlighter } from "shiki";

const hightlightThemeLight = "github-light";
const hightlightThemeDark = "github-dark";

const highlighter = await createHighlighter({
    themes: [hightlightThemeLight, hightlightThemeDark],
    langs: ["javascript", "typescript", "cpp", "python"]
});

const mdsvexConfig = mdsvex({
    extensions: [".md", ".svx"],
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatexSvelte],
    highlight: {
        highlighter: (code, lang = "text") => {
            return highlighter.codeToHtml(code, {
                lang,
                themes: {
                    light: hightlightThemeLight,
                    dark: hightlightThemeDark
                },
                defaultColor: false
            });
        }
    }
});

export default {
    extensions: [".svelte", ".md", ".svx"],
    preprocess: [
        mdsvexConfig,
        vitePreprocess()
    ],
    kit: {
        adapter: adapter()
    }
};
