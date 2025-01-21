<script lang="ts">
    import { base } from "$app/paths";

    import Meta from "$lib/Meta.svelte";

    const beginner: string = "Beginner";
    const intermediate: string = "Intermediate";
    const advanced: string = "Advanced";

    const skills = [
        {
            category: "Machine learning and data science",
            items: [
                { name: "Python", level: advanced, icon: "icons/python.svg" },
                { name: "NumPy", level: advanced, icon: "icons/numpy.svg" },
                { name: "SciPy", level: intermediate, icon: "icons/scipy.svg" },
                { name: "Matplotlib", level: intermediate, icon: "icons/matplotlib.svg" },
                { name: "Pandas", level: beginner, icon: "icons/pandas.svg" },
                { name: "OpenCV", level: beginner, icon: "icons/opencv.svg" },
                { name: "scikit-learn", level: intermediate, icon: "icons/scikitlearn.svg" },
                { name: "PyTorch", level: advanced, icon: "icons/pytorch.svg" },
                { name: "JAX", level: intermediate, icon: "icons/jax.svg" },
                { name: "Transformers", level: beginner, icon: "icons/huggingface.svg" }
            ]
        },
        {
            category: "Other programming",
            items: [
                { name: "C", level: advanced, icon: "icons/c.svg" },
                { name: "C++", level: advanced, icon: "icons/cplusplus.svg" },
                { name: "CUDA", level: beginner, icon: "icons/nvidia.svg" },
                { name: "Java", level: intermediate, icon: "icons/java.svg" },
                { name: "Haskell", level: beginner, icon: "icons/haskell.svg" },
                { name: "MATLAB", level: intermediate, icon: "icons/matlab.svg" },
                { name: "ROS", level: beginner, icon: "icons/ros.svg" },
                { name: "SQL", level: intermediate, icon: "icons/database.svg" },
                { name: "SystemVerilog", level: beginner, icon: "icons/systemverilog.svg" }
            ]
        },
        {
            category: "Web technologies",
            items: [
                { name: "HTML", level: intermediate, icon: "icons/html5.svg" },
                { name: "CSS", level: intermediate, icon: "icons/css3.svg" },
                { name: "JavaScript", level: intermediate, icon: "icons/javascript.svg" },
                { name: "TypeScript", level: beginner, icon: "icons/typescript.svg" },
                { name: "Svelte (kit)", level: beginner, icon: "icons/svelte.svg" },
                { name: "Tailwind CSS", level: beginner, icon: "icons/tailwindcss.svg" },
                { name: "Node.js", level: beginner, icon: "icons/nodejs.svg" },
                { name: "Flask", level: beginner, icon: "icons/flask.svg" }
            ]
        },
        {
            category: "Tools and software",
            items: [
                { name: "Arch Linux", level: advanced, icon: "icons/archlinux.svg" },
                { name: "Neovim", level: intermediate, icon: "icons/neovim.svg" },
                { name: "Git", level: intermediate, icon: "icons/git.svg" },
                { name: "CMake", level: beginner, icon: "icons/cmake.svg" },
                { name: "Docker", level: beginner, icon: "icons/docker.svg" },
                { name: "PostgreSQL", level: beginner, icon: "icons/postgresql.svg" },
                { name: "Simulink", level: beginner, icon: "icons/simulink.png" },
                { name: "GIMP", level: intermediate, icon: "icons/gimp.svg" },
                { name: "Blender", level: beginner, icon: "icons/blender.svg" },
                { name: "llama.cpp", level: intermediate, icon: "icons/llamacpp.png" },
                { name: "vLLM", level: beginner, icon: "icons/vllm.png" },
                { name: "LangChain", level: beginner, icon: "icons/langchain.svg" }
            ]
        },
        {
            category: "Natural languages",
            items: [
                { name: "Norwegian", level: "Native", icon: "icons/norway.svg" },
                { name: "English", level: "C2", icon: "icons/unitedkingdom.svg" },
                { name: "Spanish", level: "B1", icon: "icons/spain.svg" }
            ]
        },
        {
            category: "",
            items: []
        }
    ];
</script>

<Meta name="Skills" />

<div class="flex flex-wrap justify-center pt-5">
    {#each skills as skill}
        <section
            class="mx-10 my-2 h-min min-w-[600px] rounded-xl bg-surface-200 {skill.category !== ''
                ? 'p-3'
                : ''} shadow-xl dark:bg-surface-900 {skill.category === 'Tools and software'
                ? '2xl:translate-y-[-40px]'
                : ''} {skill.category === 'Natural languages' ? '2xl:translate-y-[-140px]' : ''}"
        >
            {#if skill.category !== ""}
                <h2 class="mb-4 border-b-2 border-current pb-2 text-2xl">
                    {skill.category}
                </h2>
                <ul class="space-y-0">
                    {#each skill.items as item}
                        <li class="flex items-center justify-between">
                            <span class="flex text-lg"><img src={item.icon} class="size-7 pr-1" alt="Skill icon" />{item.name}</span>
                            <span class="text-sm italic">{item.level}</span>
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>
    {/each}
</div>
