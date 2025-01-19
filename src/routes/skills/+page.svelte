<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    const skills = [
        {
            category: "Machine Learning",
            items: [
                { name: "Python", level: "Advanced" },
                { name: "NumPy", level: "Advanced" },
                { name: "SciPy", level: "Intermediate" },
                { name: "Matplotlib", level: "Intermediate" },
                { name: "scikit-learn", level: "Intermediate" },
                { name: "PyTorch", level: "Advanced" },
                { name: "JAX", level: "Intermediate" },
                { name: "OpenCV", level: "Beginner" }
            ]
        },
        {
            category: "Web",
            items: [
                { name: "HTML", level: "Intermediate" },
                { name: "CSS", level: "Intermediate" },
                { name: "JavaScript", level: "Intermediate" },
                { name: "TypeScript", level: "Beginner" },
                { name: "Svelte", level: "Beginner" },
                { name: "SvelteKit", level: "Beginner" },
                { name: "Tailwind CSS", level: "Beginner" }
            ]
        },
        {
            category: "Misc",
            items: [
                { name: "C", level: "Advanced" },
                { name: "C++", level: "Advanced" },
                { name: "SQL", level: "Intermediate" },
                { name: "Java", level: "Intermediate" },
                { name: "MATLAB", level: "Beginner" },
                { name: "SystemVerilog", level: "Beginner" }
            ]
        },
        {
            category: "Tools",
            items: [
                { name: "Arch Linux", level: "Advanced" },
                { name: "Hyprland", level: "Advanced" },
                { name: "Neovim", level: "Intermediate" },
                { name: "Git", level: "Intermediate" },
                { name: "Docker", level: "Beginner" },
                { name: "PostgreSQL", level: "Beginner" },
                { name: "ROS", level: "Beginner" },
                { name: "Simulink", level: "Beginner" },
                { name: "GIMP", level: "Intermediate" },
                { name: "Blender", level: "Beginner" }
            ]
        }
    ];
</script>

<Meta name="Skills" />

<div class="container mx-auto p-10">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {#each skills as skill}
            <section>
                <h2 class="mb-4 border-b-2 pb-2 text-2xl">
                    {skill.category}
                </h2>
                <ul class="space-y-2">
                    {#each skill.items as item}
                        <li class="flex items-center justify-between">
                            <span class="text-lg">{item.name}</span>
                            <span class="text-sm italic">{item.level}</span>
                        </li>
                    {/each}
                </ul>
            </section>
        {/each}
    </div>
</div>
