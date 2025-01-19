<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    // import { base } from "$app/paths";

    const sections = [
        {
            title: "About me",
            paragraphs: [
                "Scalingpilled singularitarian. Future paperclip.",
                "Software engineer, focusing on machine learning and control theory. During university, I ended up pursuing two different study programs in parallel, and now have dual MSc degrees. First degree completed was in Computer Science, and the second was in Cybernetics and Robotics. I'm generally passionate about math, programming and AI, and applying these for solving problems.",
                "I'm particularly interested in exploring the intersection of deep learning and dynamical systems, along with applications related to scientific machine learning. This includes areas of research like: Neural Ordinary Differential Equations, Physics-Informed Neural Networks and Fourier Neural Operators.",
                "I'm also interested in various other technical areas, including: high-performance and parallel computing, probabilistic AI, LLMs, computer vision and robotics."
            ]
        },
        {
            title: "Technology",
            paragraphs: [
                "I use Arch Linux (btw) with a tiling window manager, and feel comfortable working in terminals. For programming and text-editing I default to Neovim with a personalized config. I'm generally a fan of free and open source software.",
                "I love to learn new things and expand my knowledge and skill set. I believe in using the right tool for the job, which opens up opportunities to learn and explore new theories, technologies and approaches.",
                "I enjoy programming on different hardware abstraction levels. For example low-level programming in C or C++ for high-performance systems, or higher-level programming in Python or JavaScript for building applications. For machine learning and numerical computing, I prefer working with JAX in Python in a functional programming style.",
                "Math has always been one of my favorite subjects. But after a certain point I realized I care less about doing math for its own sake, and more as a tool that can be applied. And learning more math and statistics has shown itself to be very useful for understanding many technical concepts at a deeper level. In particular, I have taken some supplementary graduate-level courses in functional analysis, measure theory, partial differential equations and dynamical systems theory, mostly after graduating from the other study programs."
            ]
        },
        {
            title: "Other interests",
            paragraphs: [
                "I'm also a huge fitness nerd that is currently doing a lot of powerlifting. And additionally, I like to practice and spar in boxing and MMA.",
                "I have also always been fascinated by the ocean and aquatic environments, so I love to do both scuba diving and freediving."
            ]
        }
    ];
</script>

<Meta name="About" />

<div class="grid gap-5 px-10 pt-10">
    {#each sections as section}
        <section>
            <h4 class="text-2xl font-semibold">{section.title}</h4>
            {#each section.paragraphs as paragraph}
                <p class="mt-4 text-gray-600 dark:text-gray-400">{paragraph}</p>
            {/each}
        </section>
    {/each}
</div>

<!-- <div class="grid gap-5 pt-10 lg:grid-cols-2"> -->
<!--     <div class="flex justify-center"> -->
<!--         <img src="{base}/images/MassSpringDamper.jpg" alt="Mass spring damper vector field" width="600" height="450" /> -->
<!--     </div> -->
<!--     <div class="flex justify-center"> -->
<!--         <img src="{base}/images/Burger.jpg" alt="Burgers' equation plot" width="600" height="450" /> -->
<!--     </div> -->
<!-- </div> -->
