<script lang="ts">
    import { onMount } from "svelte";
    import type { Renderer } from "./renderer";

    let webglSupported = $state(true);

    let canvas: HTMLCanvasElement = $state()!;

    onMount(() => {
        let cancelled = false;
        let cleanup: (() => void) | undefined;

        Promise.all([import("./renderer"), import("./simulation")])
            .then(([{ Renderer }, { SimulationState }]) => {
                if (cancelled) {
                    return;
                }
                if (canvas == null) {
                    webglSupported = false;
                    return;
                }

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
                simulationState.copyTo(simulationStatePrevious);

                renderer.initializeVertices(simulationState);

                const MAX_DT = 0.05;
                let timestampPrevious: DOMHighResTimeStamp = performance.now();
                let timestepAccumulator: number = 0.0;
                const fixedPhysicsTimestep = 1e-2;

                let animationFrameId: number;
                let isAnimating = true;

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

                function handleVisibilityChange() {
                    if (document.hidden) {
                        if (isAnimating) {
                            cancelAnimationFrame(animationFrameId);
                            isAnimating = false;
                        }
                    } else {
                        if (!isAnimating) {
                            timestampPrevious = performance.now();
                            animationFrameId = requestAnimationFrame(animate);
                            isAnimating = true;
                        }
                    }
                }

                document.addEventListener("visibilitychange", handleVisibilityChange);

                animationFrameId = requestAnimationFrame(animate);

                cleanup = () => {
                    cancelAnimationFrame(animationFrameId);
                    document.removeEventListener("visibilitychange", handleVisibilityChange);
                    resizeObserver.disconnect();
                    renderer.controls.dispose();
                    renderer.scene.remove(renderer.mesh);
                    renderer.geometry.dispose();
                    renderer.material.dispose();
                    renderer.threeRenderer.dispose();
                };
            })
            .catch(() => {
                if (cancelled) {
                    return;
                }
                webglSupported = false;
            });

        return () => {
            cancelled = true;
            cleanup?.();
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
