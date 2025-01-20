<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    const beginner: string = "Beginner";
    const intermediate: string = "Intermediate";
    const advanced: string = "Advanced";

    const skills = [
        {
            category: "Machine learning / data science",
            items: [
                { name: "Python", level: advanced },
                { name: "NumPy", level: advanced },
                { name: "SciPy", level: intermediate },
                { name: "Matplotlib", level: intermediate },
                { name: "scikit-learn", level: intermediate },
                { name: "PyTorch", level: advanced },
                { name: "JAX", level: intermediate },
                { name: "OpenCV", level: beginner }
            ]
        },
        {
            category: "Other programming",
            items: [
                { name: "C", level: advanced },
                { name: "C++", level: advanced },
                { name: "CUDA", level: beginner },
                { name: "Java", level: intermediate },
                { name: "Haskell", level: beginner },
                { name: "MATLAB", level: beginner },
                { name: "SQL", level: intermediate },
                { name: "SystemVerilog", level: beginner }
            ]
        },
        {
            category: "Web technologies",
            items: [
                { name: "HTML", level: intermediate },
                { name: "CSS", level: intermediate },
                { name: "JavaScript", level: intermediate },
                { name: "TypeScript", level: beginner },
                { name: "Svelte", level: beginner },
                { name: "SvelteKit", level: beginner },
                { name: "Tailwind CSS", level: beginner }
            ]
        },
        {
            category: "Tools / software",
            items: [
                { name: "Arch Linux", level: advanced },
                { name: "Neovim", level: intermediate },
                { name: "Git", level: intermediate },
                { name: "Docker", level: beginner },
                { name: "PostgreSQL", level: beginner },
                { name: "ROS", level: beginner },
                { name: "Simulink", level: beginner },
                { name: "GIMP", level: intermediate },
                { name: "Blender", level: beginner }
            ]
        }
    ];
</script>

<Meta name="Skills" />

<div class="mt-10 grid gap-x-20 gap-y-5 lg:grid-cols-2">
    {#each skills as skill}
        <section>
            <h2 class="mb-4 border-b-2 border-current pb-2 text-2xl">
                {skill.category}
            </h2>
            <ul class="space-y-1">
                {#each skill.items as item}
                    <li class="flex items-center justify-between">
                        <span class="flex text-lg"> {item.name}</span>
                        <span class="text-sm italic">{item.level}</span>
                    </li>
                {/each}
            </ul>
        </section>
    {/each}
</div>
