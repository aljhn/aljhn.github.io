<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import CanvasWorker from "$lib/CanvasWorker?worker";

    let canvas: HTMLCanvasElement;
    let worker: Worker | undefined = undefined;

    onMount(() => {
        const canvasDiv: HTMLElement = document.getElementById("canvasDiv")!;
        canvas.width = canvasDiv.clientWidth;
        canvas.height = canvasDiv.clientHeight;

        const mainRoot: HTMLElement = document.getElementById("mainRoot")!;

        if (worker === undefined) {
            worker = new CanvasWorker();

            const offscreenCanvas: OffscreenCanvas = canvas.transferControlToOffscreen();
            worker.postMessage({ canvas: offscreenCanvas }, [offscreenCanvas]);

            const resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
                worker?.postMessage({ width: canvasDiv.clientWidth, height: canvasDiv.clientHeight });
            });
            resizeObserver.observe(canvasDiv);

            let lastBackgroundColor: string = window.getComputedStyle(mainRoot).backgroundColor;
            worker.postMessage({ backgroundColor: lastBackgroundColor });

            function sendBackgroundColor() {
                if (worker === undefined) {
                    return;
                }

                const backgroundColor: string = window.getComputedStyle(mainRoot).backgroundColor;
                if (backgroundColor !== lastBackgroundColor) {
                    worker?.postMessage({ backgroundColor: backgroundColor });
                    lastBackgroundColor = backgroundColor;
                    setTimeout(sendBackgroundColor, 10);
                } else {
                    setTimeout(sendBackgroundColor, 100);
                }
            }

            sendBackgroundColor();
        }
    });

    onDestroy(() => {
        worker?.terminate();
        worker = undefined;
    });
</script>

<div class="size-full" id="canvasDiv">
    <canvas bind:this={canvas}>Dynamical system simulation</canvas>
</div>
