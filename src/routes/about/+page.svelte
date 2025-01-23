<script lang="ts">
    import Meta from "$lib/Meta.svelte";
    import Sections from "$lib/Sections.svelte";

    const sections = [
        {
            title: "About me",
            paragraphs: [
                "Software engineer, focusing on machine learning and control theory. I'm generally passionate about math, programming and AI, and applying these for solving problems.",
                "I studied at NTNU in Trondheim, and I ended up pursuing two different study programs in parallel, now holding dual MSc degrees. First degree completed was in Computer Science, and the second was in Cybernetics and Robotics.",
                "I am particularly interested in research at the intersection of deep learning and dynamical systems, along with applications related to scientific machine learning. This includes areas of research like: Neural Ordinary Differential Equations, Physics-Informed Neural Networks and Fourier Neural Operators.",
                "I'm also interested in various other technical areas, including: high-performance and parallel computing, probabilistic AI, LLMs, computer vision and robotics. I especially try to keep up with the state of the art and open source ecosystems for LLMs and other generative models."
            ]
        },
        {
            title: "Technology",
            paragraphs: [
                "I use Arch Linux (btw) with a tiling window manager, and feel comfortable working in terminals. For programming and text-editing I default to Neovim with a personalized config. I'm generally a fan of free and open source software. I also believe in using the right tool for the job.",
                "I enjoy programming on all kinds of abstraction levels. C or C++ for performance-intensive systems, or Python or JavaScript for rapid prototyping and building applications. For machine learning and numerical computing, I currently do most of my best work with Python and JAX.",
                "Math has always been one of my favorite subjects, and I have taken some supplementary graduate-level courses. More particularly: functional analysis, measure theory, partial differential equations and dynamical systems theory."
            ]
        },
        {
            title: "Other interests",
            paragraphs: [
                "I'm also a fitness nerd that is currently doing a lot of powerlifting. And additionally, I like to practice and spar in boxing and MMA.",
                "I have also always been fascinated by the ocean and aquatic environments, so I love to do both scuba diving and freediving."
            ]
        }
    ];
</script>

<Meta name="About" />

<Sections {sections} />
