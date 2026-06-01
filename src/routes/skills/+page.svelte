<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    const beginner: string = "Beginner";
    const intermediate: string = "Intermediate";
    const advanced: string = "Advanced";

    const skills = [
        {
            category: "Programming Languages",
            items: [
                { name: "Python", level: advanced, icon: "/icons/python.svg" },
                { name: "C++", level: advanced, icon: "/icons/cplusplus.svg" },
                { name: "C", level: intermediate, icon: "/icons/c.svg" },
                //{ name: "CUDA", level: beginner, icon: "/icons/nvidia.svg" },
                // { name: "Java", level: intermediate, icon: "/icons/java.svg" },
                { name: "MATLAB", level: intermediate, icon: "/icons/matlab.svg" },
                { name: "Haskell", level: beginner, icon: "/icons/haskell.svg" }
            ]
        },
        {
            category: "Web",
            items: [
                { name: "HTML", level: intermediate, icon: "/icons/html5.svg" },
                { name: "CSS", level: intermediate, icon: "/icons/css3.svg" },
                { name: "JavaScript", level: intermediate, icon: "/icons/javascript.svg" },
                { name: "TypeScript", level: beginner, icon: "/icons/typescript.svg" },
                { name: "Svelte (Kit)", level: beginner, icon: "/icons/svelte.svg" },
                //{ name: "Tailwind CSS", level: beginner, icon: "/icons/tailwindcss.svg" },
                { name: "Flask", level: beginner, icon: "/icons/flask.svg" }
            ]
        },
        {
            category: "Machine Learning and Scientific Computing",
            items: [
                { name: "NumPy", level: advanced, icon: "/icons/numpy.svg" },
                { name: "SciPy", level: intermediate, icon: "/icons/scipy.svg" },
                { name: "Matplotlib", level: intermediate, icon: "/icons/matplotlib.svg" },
                { name: "scikit-learn", level: intermediate, icon: "/icons/scikitlearn.svg" },
                { name: "Pandas", level: beginner, icon: "/icons/pandas.svg" },
                { name: "PyTorch", level: advanced, icon: "/icons/pytorch.svg" },
                { name: "JAX", level: advanced, icon: "/icons/jax.svg" },
                { name: "Transformers", level: beginner, icon: "/icons/huggingface.svg" },
                { name: "OpenCV", level: beginner, icon: "/icons/opencv.svg" },
                { name: "ROS", level: beginner, icon: "/icons/ros.svg" }
            ]
        },
        {
            category: "Tools",
            items: [
                { name: "Linux", level: advanced, icon: "/icons/archlinux.svg" },
                { name: "Vim", level: intermediate, icon: "/icons/neovim.svg" },
                { name: "Git", level: intermediate, icon: "/icons/git.svg" },
                { name: "Docker", level: beginner, icon: "/icons/docker.svg" },
                //{ name: "PostgreSQL", level: beginner, icon: "/icons/postgresql.svg" },
                { name: "gTest", level: intermediate, icon: "/icons/google.svg" },
                //{ name: "CMake", level: beginner, icon: "/icons/cmake.svg" },
                //{ name: "GIMP", level: intermediate, icon: "/icons/gimp.svg" },
                //{ name: "Blender", level: beginner, icon: "/icons/blender.svg" },
                { name: "SQL", level: intermediate, icon: "/icons/database.svg" }
            ]
        }
        /*{
            category: "Natural Languages",
            items: [
                { name: "Norwegian", level: "Native", icon: "/icons/norway.svg" },
                { name: "English", level: "C1", icon: "/icons/us.svg" },
                { name: "Spanish", level: "A2", icon: "/icons/spain.svg" }
            ]
        }*/
    ];
</script>

<Meta name="Skills" />

<div class="mx-auto columns-1 gap-8 px-5 pt-10 pb-20 lg:max-w-10/12 lg:columns-2 lg:px-0">
    {#each skills as skill}
        {#if skill.category !== ""}
            <div class="mb-8 break-inside-avoid px-0 lg:px-10">
                <section class="bg-bglight-2 dark:bg-bgdark-2 darkModeFade rounded-xl p-3 shadow-xl">
                    <h2
                        class="text-textlight-1 dark:text-textdark-1 darkModeFade mb-4 border-b-2 border-current pb-2 font-mono text-2xl font-semibold"
                    >
                        {skill.category}
                    </h2>
                    <ul class="space-y-2">
                        {#each skill.items as item}
                            <li class="flex items-center justify-between">
                                <span class="flex items-center space-x-2">
                                    <img src={item.icon} class="size-7 object-contain" alt="{item.name} icon" />
                                    <p class="font-mono text-lg">{item.name}</p>
                                </span>
                            </li>
                        {/each}
                    </ul>
                </section>
            </div>
        {/if}
    {/each}
</div>
