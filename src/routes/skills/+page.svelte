<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    import Meta from "$lib/Meta.svelte";

    const beginner: string = "Beginner";
    const intermediate: string = "Intermediate";
    const advanced: string = "Advanced";

    const skills = [
        {
            category: "Programming languages",
            items: [
                { name: "Python", level: advanced, icon: "/icons/python.svg" },
                { name: "C++", level: advanced, icon: "/icons/cplusplus.svg" },
                { name: "C", level: intermediate, icon: "/icons/c.svg" },
                { name: "CUDA", level: beginner, icon: "/icons/nvidia.svg" },
                { name: "Java", level: intermediate, icon: "/icons/java.svg" },
                { name: "MATLAB", level: intermediate, icon: "/icons/matlab.svg" },
                { name: "Haskell", level: beginner, icon: "/icons/haskell.svg" },
                { name: "SQL", level: intermediate, icon: "/icons/database.svg" }
            ]
        },
        {
            category: "Machine learning and scientific computing",
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
            category: "Web technologies",
            items: [
                { name: "HTML", level: intermediate, icon: "/icons/html5.svg" },
                { name: "CSS", level: intermediate, icon: "/icons/css3.svg" },
                { name: "JavaScript", level: intermediate, icon: "/icons/javascript.svg" },
                { name: "TypeScript", level: beginner, icon: "/icons/typescript.svg" },
                { name: "Svelte (Kit)", level: beginner, icon: "/icons/svelte.svg" },
                { name: "Tailwind CSS", level: beginner, icon: "/icons/tailwindcss.svg" },
                { name: "Flask", level: beginner, icon: "/icons/flask.svg" }
            ]
        },
        {
            category: "Tools and software",
            items: [
                { name: "Arch Linux", level: advanced, icon: "/icons/archlinux.svg" },
                { name: "Neovim", level: intermediate, icon: "/icons/neovim.svg" },
                { name: "Git", level: intermediate, icon: "/icons/git.svg" },
                { name: "Docker", level: beginner, icon: "/icons/docker.svg" },
                { name: "PostgreSQL", level: beginner, icon: "/icons/postgresql.svg" },
                { name: "gTest / gMock", level: intermediate, icon: "/icons/google.svg" },
                { name: "CMake", level: beginner, icon: "/icons/cmake.svg" },
                { name: "GIMP", level: intermediate, icon: "/icons/gimp.svg" },
                { name: "Blender", level: beginner, icon: "/icons/blender.svg" }
            ]
        },
        {
            category: "Natural languages",
            items: [
                { name: "Norwegian", level: "Native", icon: "/icons/norway.svg" },
                { name: "English", level: "C2", icon: "/icons/us.svg" },
                { name: "Spanish", level: "B1", icon: "/icons/spain.svg" }
            ]
        }
    ];

    onMount(() => {
        const divPadding: number = 16;

        const skillsGridRoot: HTMLElement = document.getElementById("skillsGridRoot")!;
        const skillDivs: HTMLCollection = skillsGridRoot.children;

        function addPadding() {
            let columns: number = 1;
            if (window.matchMedia("(min-width: 1024px)").matches) {
                columns = 2;
            }

            for (let i = 0; i < skillDivs.length; i++) {
                (skillDivs[i] as HTMLElement).style.transform = `translateY(0px)`;
            }

            for (let i = columns; i < skillDivs.length; i++) {
                const currentDiv: HTMLElement = skillDivs[i] as HTMLElement;
                const aboveDiv: HTMLElement = skillDivs[i - columns] as HTMLElement;

                const offset: number =
                    currentDiv.getBoundingClientRect().top - aboveDiv.getBoundingClientRect().bottom - divPadding;

                if (offset < 0) {
                    currentDiv.style.transform = `translateY(${Math.abs(offset)}px)`;
                } else {
                    currentDiv.style.transform = `translateY(-${Math.abs(offset)}px)`;
                }
            }

            const mainHeight: number =
                window.pageYOffset +
                skillDivs[skillDivs.length - 1].getBoundingClientRect().bottom -
                document.getElementsByTagName("header")[0].getBoundingClientRect().height +
                divPadding;

            skillsGridRoot.style.height = "100%";
            document.getElementsByTagName("main")[0].style.height = mainHeight.toString() + "px";
        }

        const resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
            addPadding();
        });
        resizeObserver.observe(document.documentElement);
    });

    onDestroy(() => {
        if (browser) {
            document.getElementsByTagName("main")[0].style.height = "100%";
        }
    });
</script>

<Meta name="Skills" />

<div class="mt-5 grid grid-cols-1 pt-5 lg:grid-cols-2" id="skillsGridRoot">
    {#each skills as skill}
        <div class="h-min px-10">
            <section
                class="rounded-xl bg-neutral-100 dark:bg-neutral-900 {skill.category !== '' ? 'p-3' : ''} shadow-xl"
            >
                {#if skill.category !== ""}
                    <h2 class="mb-4 border-b-2 border-current pb-2 font-mono text-2xl font-semibold">
                        {skill.category}
                    </h2>
                    <ul class="space-y-0">
                        {#each skill.items as item}
                            <li class="flex items-center justify-between">
                                <span class="flex space-x-1">
                                    <img src={item.icon} class="size-7 pr-1" alt="Skill icon" />
                                    <p class="font-mono text-lg">{item.name}</p>
                                </span>
                                <p class="text-sm italic">{item.level}</p>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </section>
        </div>
    {/each}
</div>
