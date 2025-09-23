<script lang="ts">
    import Meta from "$lib/Meta.svelte";
    import Sections from "$lib/Sections.svelte";
    import Research from "$lib/Research.svelte";

    const sections = [
        {
            title: "Overview",
            paragraphs: [
                "My research interests lie at the intersection of deep learning and dynamical systems. This can mean one of two things: using deep learning methods for research related to dynamical systems theory. Or the opposite, using methods from dynamical systems theory for research related to deep learning.",
                "I'm not currently affiliated with any research institution, so I'm working on a research project independently."
            ]
        },
        {
            title: "Scientific Machine Learning",
            paragraphs: [
                "Research topics like Neural Ordinary Differential Equations and Fourier Neural Operators make it possible to learn dynamical systems from data.",
                "This can be particularly useful for systems where it's hard to model system dynamics explicitly. Or if the dataset is impractical to use, for example from irregular samples."
            ]
        },
        {
            title: "Physics-Informed Machine Learning",
            paragraphs: [
                "Incorporating prior physical knowledge about a system derived from first principles can greatly simplify learning the system solution, instead of relying solely on the dataset.",
                "Physics-informed neural networks are one way to achieve this, and also make it possible to go beyond simply learning one particular system. Examples include learning unknown or missing terms of an equation, or solving optimal control problems."
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

<div class="grid lg:grid-cols-2">
    <div>
        <Sections {sections} />

        <Research papers={peerReviewedPapers} title="Peer Reviewed Papers" />
        <Research papers={masterTheses} title="Master Theses" />
    </div>

    <div class="grid auto-rows-min gap-y-10 pt-10">
        <div class="flex justify-center">
            <enhanced:img
                src="/static/images/MassSpringDamper.jpg?w=600;300"
                alt="Mass spring damper vector field plot"
                class="h-[225] w-[300px] rounded-md shadow-lg md:h-[450px] md:w-[600px]"
                sizes="(min-width:768px) 600px, (min-width:640px) 300px"
            />
        </div>
        <div class="flex justify-center">
            <enhanced:img
                src="/static/images/Burger.jpg?w=600;300"
                alt="Burgers' equation plot"
                class="h-[225] w-[300px] rounded-md shadow-lg md:h-[450px] md:w-[600px]"
                sizes="(min-width:768px) 600px, (min-width:640px) 300px"
            />
        </div>
    </div>
</div>
