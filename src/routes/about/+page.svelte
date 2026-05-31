<script lang="ts">
    import Meta from "$lib/Meta.svelte";
    import Sections from "$lib/Sections.svelte";

    const sections = [
        {
            title: "Background",
            paragraphs: [
                "Software engineer, specializing in machine learning and control theory. I'm generally passionate about math, programming and AI, and applying these to solve problems.",
                "I studied at NTNU in Trondheim, and I completed two different MSc degrees in parallel. First degree in Computer Science, and the second in Cybernetics and Robotics."
            ]
        },
        {
            title: "Interests",
            paragraphs: [
                "I am particularly interested in the combination of deep learning and dynamical systems. This includes methods like Neural Ordinary Differential Equations, Physics Informed Neural Networks and Neural Operators.",
                "I also have a more general interest in deep learning, including applied areas like computer vision and LLMs.",
                "And I like math, especially subjects like: dynamical systems theory, functional analysis and optimization."
            ]
        },
        {
            title: "Misc",
            paragraphs: [
                "I'm a fitness nerd that is currently doing a lot of powerlifting.",
                "Also a fan of scuba diving, swimming and boxing."
            ]
        }
    ];
</script>

<Meta name="About" />

<div class="mx-auto pt-10 pb-20 lg:max-w-10/12">
    <Sections {sections} />
</div>
