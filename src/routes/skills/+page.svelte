<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    import Archlinux from "$lib/icons/archlinux.svelte";
    import Blender from "$lib/icons/blender.svelte";
    import C from "$lib/icons/c.svelte";
    import CMake from "$lib/icons/cmake.svelte";
    import Cplusplus from "$lib/icons/cplusplus.svelte";
    import CSS3 from "$lib/icons/css3.svelte";
    import Database from "$lib/icons/database.svelte";
    import Docker from "$lib/icons/docker.svelte";
    import Flask from "$lib/icons/flask.svelte";
    import GIMP from "$lib/icons/gimp.svelte";
    import Git from "$lib/icons/git.svelte";
    import Google from "$lib/icons/google.svelte";
    import Haskell from "$lib/icons/haskell.svelte";
    import HTML5 from "$lib/icons/html5.svelte";
    import HuggingFace from "$lib/icons/huggingface.svelte";
    import Java from "$lib/icons/java.svelte";
    import JavaScript from "$lib/icons/javascript.svelte";
    import JAX from "$lib/icons/jax.svelte";
    import MATLAB from "$lib/icons/matlab.svelte";
    import Matplotlib from "$lib/icons/matplotlib.svelte";
    import Neovim from "$lib/icons/neovim.svelte";
    import Norway from "$lib/icons/norway.svelte";
    import NumPy from "$lib/icons/numpy.svelte";
    import Nvidia from "$lib/icons/nvidia.svelte";
    import OpenCV from "$lib/icons/opencv.svelte";
    import Pandas from "$lib/icons/pandas.svelte";
    import PostgreSQL from "$lib/icons/postgresql.svelte";
    import Python from "$lib/icons/python.svelte";
    import PyTorch from "$lib/icons/pytorch.svelte";
    import ROS from "$lib/icons/ros.svelte";
    import scikitlearn from "$lib/icons/scikitlearn.svelte";
    import SciPy from "$lib/icons/scipy.svelte";
    import Spain from "$lib/icons/spain.svelte";
    import Svelte from "$lib/icons/svelte.svelte";
    import TailwindCSS from "$lib/icons/tailwindcss.svelte";
    import TypeScript from "$lib/icons/typescript.svelte";
    import US from "$lib/icons/us.svelte";

    import Meta from "$lib/Meta.svelte";

    const beginner: string = "Beginner";
    const intermediate: string = "Intermediate";
    const advanced: string = "Advanced";

    const skills = [
        {
            category: "Programming languages",
            items: [
                { name: "Python", level: advanced, icon: Python },
                { name: "C++", level: advanced, icon: Cplusplus },
                { name: "C", level: intermediate, icon: C },
                { name: "CUDA", level: beginner, icon: Nvidia },
                { name: "Java", level: intermediate, icon: Java },
                { name: "MATLAB", level: intermediate, icon: MATLAB },
                { name: "Haskell", level: beginner, icon: Haskell },
                { name: "SQL", level: intermediate, icon: Database }
            ]
        },
        {
            category: "Machine learning and scientific computing",
            items: [
                { name: "NumPy", level: advanced, icon: NumPy },
                { name: "SciPy", level: intermediate, icon: SciPy },
                { name: "Matplotlib", level: intermediate, icon: Matplotlib },
                { name: "scikit-learn", level: intermediate, icon: scikitlearn },
                { name: "Pandas", level: beginner, icon: Pandas },
                { name: "PyTorch", level: advanced, icon: PyTorch },
                { name: "JAX", level: advanced, icon: JAX },
                { name: "Transformers", level: beginner, icon: HuggingFace },
                { name: "OpenCV", level: beginner, icon: OpenCV },
                { name: "ROS", level: beginner, icon: ROS }
            ]
        },
        {
            category: "Web technologies",
            items: [
                { name: "HTML", level: intermediate, icon: HTML5 },
                { name: "CSS", level: intermediate, icon: CSS3 },
                { name: "JavaScript", level: intermediate, icon: JavaScript },
                { name: "TypeScript", level: beginner, icon: TypeScript },
                { name: "Svelte (Kit)", level: beginner, icon: Svelte },
                { name: "Tailwind CSS", level: beginner, icon: TailwindCSS },
                { name: "Flask", level: beginner, icon: Flask }
            ]
        },
        {
            category: "Tools and software",
            items: [
                { name: "Arch Linux", level: advanced, icon: Archlinux },
                { name: "Neovim", level: intermediate, icon: Neovim },
                { name: "Git", level: intermediate, icon: Git },
                { name: "Docker", level: beginner, icon: Docker },
                { name: "PostgreSQL", level: beginner, icon: PostgreSQL },
                { name: "gTest / gMock", level: intermediate, icon: Google },
                { name: "CMake", level: beginner, icon: CMake },
                { name: "GIMP", level: intermediate, icon: GIMP },
                { name: "Blender", level: beginner, icon: Blender }
            ]
        },
        {
            category: "Natural languages",
            items: [
                { name: "Norwegian", level: "Native", icon: Norway },
                { name: "English", level: "C2", icon: US },
                { name: "Spanish", level: "B1", icon: Spain }
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
                                <span class="flex space-x-1"
                                    ><item.icon />
                                    <p class="font-mono text-lg">{item.name}</p></span
                                >
                                <p class="text-sm italic">{item.level}</p>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </section>
        </div>
    {/each}
</div>
