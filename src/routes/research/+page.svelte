<script lang="ts">
    import { base } from "$app/paths";

    import Meta from "$lib/Meta.svelte";
    import Sections from "$lib/Sections.svelte";
    import Research from "$lib/Research.svelte";

    const sections = [
        {
            title: "Overview",
            paragraphs: ["TODO"]
        },
        {
            title: "Scientific machine learning",
            paragraphs: ["TODO"]
        },
        {
            title: "Physics-informed machine learning",
            paragraphs: ["TODO"]
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

    <div class="grid gap-y-10 pt-10 auto-rows-min">
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
