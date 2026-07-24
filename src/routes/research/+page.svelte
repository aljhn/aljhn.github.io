<script lang="ts">
    import Meta from "$lib/Meta.svelte";
    import Sections from "$lib/Sections.svelte";
    import Research from "$lib/Research.svelte";

    const sections = [
        {
            title: "Overview",
            paragraphs: [
                "My research interests lie at the intersection of deep learning and dynamical systems.",
                "This typically includes topics related to scientific machine learning and data-driven dynamical systems, with applications like system identification, time-series modeling and optimal control.",
                "I'm not affiliated with any research institution, so I'm currently working on a research project independently."
            ]
        }
    ];

    const peerReviewedPapers = [
        {
            title: "Work in progress",
            authors: "",
            conference: "",
            year: 2026,
            link: "",
            pdf: ""
        },
        {
            title: "Learning Ordinary Differential Equations with the Line Integral Loss Function",
            authors: "Albert Johannessen",
            conference: "NeurIPS 2022 Workshop - The Symbiosis of Deep Learning and Differential Equations II",
            year: 2022,
            link: "https://openreview.net/forum?id=6EvTvGpiXe0",
            pdf: "papers/LineIntegralLoss.pdf"
        }
    ];

    const masterTheses = [
        {
            title: "Modeling Dynamical Systems with Physics Informed Neural Networks with Applications to PDE-Constrained Optimal Control Problems",
            authors: "Albert Johannessen",
            conference: "Norwegian Research Information Repository",
            year: 2024,
            link: "https://nva.sikt.no/registration/0198ec6407ac-73371548-6668-4c6c-bfc1-1b8452106fa6",
            pdf: "papers/MasterThesis2.pdf"
        },
        {
            title: "Motion Classification with Neural Ordinary Differential Equations",
            authors: "Albert Johannessen",
            conference: "Norwegian Research Information Repository",
            year: 2022,
            link: "https://nva.sikt.no/registration/0198eaba1be8-c870f8f5-94b4-4643-a358-6c7904de4be6",
            pdf: "papers/MasterThesis.pdf"
        }
    ];
</script>

<Meta title="Research" />

<div class="mx-auto w-full max-w-5xl grid gap-8 px-5 pt-10 pb-20 lg:grid-cols-2">
    <div>
        <Sections {sections} />

        <Research papers={peerReviewedPapers} title="Peer Reviewed Papers" />
        <Research papers={masterTheses} title="Master Theses" />
    </div>

    <div class="grid auto-rows-min gap-y-10 pt-10 lg:pt-0">
        <div class="flex justify-center">
            <enhanced:img
                src="/static/images/MassSpringDamper.png?w=1600;800"
                alt="Mass spring damper vector field plot"
                class="w-full max-w-full rounded-md shadow-lg"
                sizes="(min-width:768px) 1600px, 800px"
            />
        </div>
        <div class="flex justify-center">
            <enhanced:img
                src="/static/images/Burger.png?w=1600;800"
                alt="Burgers' equation plot"
                class="w-full max-w-full rounded-md shadow-lg"
                sizes="(min-width:768px) 1600px, 800px"
            />
        </div>
    </div>
</div>
