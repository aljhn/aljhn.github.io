<script lang="ts">
    import { base } from "$app/paths";

    import Meta from "$lib/Meta.svelte";

    const beginner: string = "Beginner";
    const intermediate: string = "Intermediate";
    const advanced: string = "Advanced";

    const skills = [
        {
            category: "Machine learning / data science",
            items: [
                { name: "Python", level: advanced, icon: "icons/python.svg" },
                { name: "NumPy", level: advanced, icon: "icons/numpy.svg" },
                { name: "SciPy", level: intermediate, icon: "icons/scipy.svg" },
                { name: "Matplotlib", level: intermediate, icon: "icons/matplotlib.svg" },
                { name: "Pandas", level: beginner, icon: "icons/pandas.svg" },
                { name: "scikit-learn", level: intermediate, icon: "icons/scikitlearn.svg" },
                { name: "PyTorch", level: advanced, icon: "icons/pytorch.svg" },
                { name: "JAX", level: intermediate, icon: "icons/jax.svg" }
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
                { name: "MATLAB", level: beginner, icon: "icons/matlab.svg" },
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
                { name: "Svelte", level: beginner, icon: "icons/svelte.svg" },
                { name: "Tailwind CSS", level: beginner, icon: "icons/tailwindcss.svg" }
            ]
        },
        {
            category: "Tools / software",
            items: [
                { name: "Arch Linux", level: advanced, icon: "icons/archlinux.svg" },
                { name: "Neovim", level: intermediate, icon: "icons/neovim.svg" },
                { name: "Git", level: intermediate, icon: "icons/git.svg" },
                { name: "Docker", level: beginner, icon: "icons/docker.svg" },
                { name: "PostgreSQL", level: beginner, icon: "icons/postgresql.svg" },
                { name: "ROS", level: beginner, icon: "icons/ros.svg" },
                { name: "OpenCV", level: beginner, icon: "icons/opencv.svg" },
                { name: "Flask", level: beginner, icon: "icons/flask.svg" },
                { name: "Simulink", level: beginner, icon: "icons/simulink.png" },
                { name: "GIMP", level: intermediate, icon: "icons/gimp.svg" },
                { name: "Blender", level: beginner, icon: "icons/blender.svg" }
            ]
        }
    ];
</script>

<Meta name="Skills" />

<div class="mt-10 grid gap-x-20 gap-y-4 px-5 pb-10 lg:grid-cols-2">
    {#each skills as skill}
        <section class="rounded-xl bg-surface-200 p-2 shadow-xl dark:bg-surface-900">
            <h2 class="mb-4 border-b-2 border-current pb-2 text-2xl">
                {skill.category}
            </h2>
            <ul class="space-y-0">
                {#each skill.items as item}
                    <li class="flex items-center justify-between">
                        <span class="flex text-lg"><img src={item.icon} class="size-6 pr-1" />{item.name}</span>
                        <span class="text-sm italic">{item.level}</span>
                    </li>
                {/each}
            </ul>
        </section>
    {/each}
</div>
