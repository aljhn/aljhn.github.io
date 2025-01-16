<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    import { base } from "$app/paths";
</script>

<Meta name="About" />

<div class="grid gap-5 px-5 pt-10">
    <div>
        <h4 class="text-2xl font-semibold">About Me</h4>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
            Software engineer, focusing on machine learning and control theory. In university, I ended up pursuing two
            different study programs in parallel, now holding dual MSc degrees. First degree completed was in Computer
            Science, and the second was in Cybernetics and Robotics. I'm generally passionate about math, programming
            and AI, and using these for solving problems.
        </p>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
            I'm particularly interested in exploring the intersection of deep learning and dynamical systems, along with
            applications related to scientific machine learning. This includes areas of research like: Neural Ordinary
            Differential Equations, Physics-Informed Neural Networks and Fourier Neural Operators.
        </p>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
            I'm also interested in various other technical areas, including: high-performance computing, LLMs, computer
            vision and robotics.
        </p>
    </div>

    <div>
        <h4 class="text-2xl font-semibold">Technology</h4>
        <p class="mt-4 text-gray-600 dark:text-gray-400">TODO</p>
    </div>

    <div>
        <h4 class="text-2xl font-semibold">Other Interests</h4>
        <p class="mt-4 text-gray-600 dark:text-gray-400">TODO</p>
    </div>
</div>

<div class="grid gap-5 pt-10 lg:grid-cols-2">
    <div class="flex justify-center">
        <img src="{base}/images/MassSpringDamper.jpg" alt="Mass spring damper vector field" width="600" height="450" />
    </div>
    <div class="flex justify-center">
        <img src="{base}/images/Burger.jpg" alt="Burgers' equation plot" width="600" height="450" />
    </div>
</div>
