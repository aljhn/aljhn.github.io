<script lang="ts">
    import { onMount } from "svelte";
    import { Renderer } from "./renderer";
    import { SimulationState } from "./simulation";
    import { sampleUniform } from "./utils";

    let webglSupported = $state(true);

    let canvas: HTMLCanvasElement = $state()!;

    onMount(() => {
        let resizeNow = true;
        const resizeObserver = new ResizeObserver(() => {
            resizeNow = true;
        });

        resizeObserver.observe(canvas);
        const mainRoot: HTMLElement = document.getElementById("mainRoot")!;

        let backgroundColor: string;
        let darkMode: boolean;

        function updateBackground() {
            backgroundColor = window.getComputedStyle(mainRoot).backgroundColor;
            darkMode = document.documentElement.classList.contains("dark");
        }

        const PARTICLES = 100;
        const TRAIL = 300;
        const WIDTH = 0.1;

        let renderer: Renderer;

        try {
            renderer = new Renderer(canvas, PARTICLES, TRAIL, WIDTH);
        } catch {
            webglSupported = false;
            return;
        }

        const simulationState = new SimulationState(PARTICLES);
        const simulationStatePrevious = new SimulationState(PARTICLES);

        for (let i = 0; i < PARTICLES; i++) {
            const index = i * 3;
            simulationState.particlePositions[index] = sampleUniform(-5.0, 5.0);
            simulationState.particlePositions[index + 1] = sampleUniform(-5.0, 5.0);
            simulationState.particlePositions[index + 2] = sampleUniform(80.0, 100.0);

            simulationStatePrevious.particlePositions[index] = simulationState.particlePositions[index];
            simulationStatePrevious.particlePositions[index + 1] = simulationState.particlePositions[index + 1];
            simulationStatePrevious.particlePositions[index + 2] = simulationState.particlePositions[index + 2];
        }

        renderer.initializeVertices(simulationState);

        const MAX_DT = 0.05;
        let timestampPrevious: DOMHighResTimeStamp = performance.now();
        let timestepAccumulator: number = 0.0;
        const fixedPhysicsTimestep = 1e-2;

        let animationFrameId: number;

        function animate(timestamp: DOMHighResTimeStamp): void {
            updateBackground();

            const dt = Math.min((timestamp - timestampPrevious) / 1000.0, MAX_DT);
            timestampPrevious = timestamp;

            timestepAccumulator += dt;
            while (timestepAccumulator > fixedPhysicsTimestep) {
                simulationState.copyTo(simulationStatePrevious);
                simulationState.update(fixedPhysicsTimestep, darkMode);
                timestepAccumulator -= fixedPhysicsTimestep;
            }

            if (resizeNow) {
                renderer.resize(canvas.clientWidth, canvas.clientHeight);
                resizeNow = false;
            }

            const interpolateAlpha = timestepAccumulator / fixedPhysicsTimestep;
            renderer.update(simulationState, simulationStatePrevious, interpolateAlpha, backgroundColor);

            animationFrameId = requestAnimationFrame(animate);
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            renderer.controls.dispose();
            renderer.scene.remove(renderer.mesh);
            renderer.geometry.dispose();
            renderer.material.dispose();
            renderer.threeRenderer.dispose();
        };
    });
</script>

{#if webglSupported}
    <div class="relative flex-1">
        <canvas bind:this={canvas} class="absolute h-full w-full">Dynamical system simulator</canvas>
    </div>
{:else}
    <div class="flex flex-1 items-center justify-center text-lg">WebGL is not supported in your browser.</div>
{/if}
