<script lang="ts">
    import Meta from "$lib/Meta.svelte";
    import Sections from "$lib/Sections.svelte";

    const sections = [
        {
            title: "About Me",
            paragraphs: [
                "Software engineer, specializing in machine learning and control theory. I'm generally passionate about math, programming and AI, and applying these for solving problems.",
                "I studied at NTNU in Trondheim, and ended up pursuing two different study programs in parallel, now holding dual MSc degrees. First degree completed was in Computer Science, and the second was in Cybernetics and Robotics.",
                "I am particularly interested in research at the intersection of deep learning and dynamical systems. This includes areas such as: Neural Ordinary Differential Equations, Physics-Informed Neural Networks and Fourier Neural Operators.",
                "I also have other technical interests, including: high-performance and parallel computing, probabilistic AI, LLMs, computer vision and robotics. I especially try to keep up with the state of the art and open source ecosystems for LLMs and other generative models.",
                "Math has also always been one of my favorite subjects, and I have taken some supplementary graduate-level courses. More particularly: functional analysis, measure theory, partial differential equations and dynamical systems theory."
            ]
        },
        {
            title: "Technology",
            paragraphs: [
                "I use Arch Linux (btw) with a tiling window manager, and feel comfortable working in the terminal. For programming and text-editing I default to Neovim with a personalized config. I'm generally a fan of free and open source software. I also believe in using the right tool for the job.",
                "I enjoy programming on all kinds of abstraction levels. C++ for performance-intensive systems, or Python or JavaScript for rapid prototyping and building applications. For machine learning and numerical computing, I do a lot of work with Python and JAX."
            ]
        },
        {
            title: "Other Interests",
            paragraphs: [
                "I'm a fitness nerd that is currently doing a lot of powerlifting. Also a big fan of both scuba diving and freediving."
            ]
        }
    ];
</script>

<Meta name="About" />

<Sections {sections} />
