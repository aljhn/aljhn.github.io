<script lang="ts">
    import { base } from "$app/paths";

    import Meta from "$lib/Meta.svelte";
    import Sections from "$lib/Sections.svelte";
    import Research from "$lib/Research.svelte";

    const sections = [
        {
            title: "Overview",
            paragraphs: [
                "My research interests lies at the intersection of deep learning and dynamical systems. This can mean two different things. First, using deep learning methods for research related to dynamical systems theory. And the opposite, using methods from dynamical systems theory for research related to deep learning.",
                "In practice, I end up with a little both. For example, applying deep learning to applications like system identification and optimal control theory, or numerical methods and optimization from dynamical systems to deep learning architectures."
            ]
        },
        {
            title: "Scientific machine learning",
            paragraphs: [
                "Research topics like Neural Ordinary Differential Equations and Fourier Neural Operators makes it possible to learn dynamical systems from data.",
                "This can be particularly useful for systems where its hard to explicitly model system dynamcs, in traditional machine learning fashion."
            ]
        },
        {
            title: "Physics-informed machine learning",
            paragraphs: [
                "Incorporating prior physical knowledge about a system derived from first principles can greatly simplify learning a system output, instead of relying solely on the dataset.",
                "Physics-informed neural networks are one way to achieve this result, and also makes it possible to go beyong simply learning one particular system. For example by learning unknown or missing terms of an equation, or solving optimal control problems."
            ]
        }
    ];

    const peerReviewedPapers = [
        {
            title: "Work in progress",
            authors: "",
            conference: "",
            year: 2025,
            link: ""
        },
        {
            title: "Learning Ordinary Differential Equations with the Line Integral Loss Function",
            authors: "Albert Johannessen",
            conference: "NeurIPS 2022 Workshop - The Symbiosis of Deep Learning and Differential Equations II",
            year: 2022,
            link: "https://openreview.net/forum?id=6EvTvGpiXe0"
        }
    ];

    const masterTheses = [
        {
            title: "Modeling Dynamical Systems with Physics Informed Neural Networks with Applications to PDE-Constrained Optimal Control Problems",
            authors: "Albert Johannessen",
            conference: "NTNU Open",
            year: 2024,
            link: "https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/3130805"
        },
        {
            title: "Motion Classification with Neural Ordinary Differential Equations",
            authors: "Albert Johannessen",
            conference: "NTNU Open",
            year: 2022,
            link: "https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/3024692"
        }
    ];
</script>

<Meta name="Research" />

<div class="grid gap-5 lg:grid-cols-2">
    <div>
        <Sections {sections} />

        <Research papers={peerReviewedPapers} title="Peer reviewed research papers" />
        <Research papers={masterTheses} title="Master theses" />
    </div>

    <div class="grid auto-rows-min gap-y-10 pt-10">
        <div class="flex justify-center">
            <img
                src="{base}/images/MassSpringDamper.jpg"
                alt="Mass spring damper vector field"
                width="600"
                height="450"
            />
        </div>
        <div class="flex justify-center">
            <img src="{base}/images/Burger.jpg" alt="Burgers' equation plot" width="600" height="450" />
        </div>
    </div>
</div>
