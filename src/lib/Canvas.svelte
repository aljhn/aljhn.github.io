<script lang="ts">
    import CanvasWorker from "$lib/CanvasWorker?worker";

    let canvas: HTMLCanvasElement;

    $effect(() => {
        const canvasDiv: HTMLElement = document.getElementById("canvasDiv")!;
        canvas.width = canvasDiv.clientWidth;
        canvas.height = canvasDiv.clientHeight;

        const mainRoot: HTMLElement = document.getElementById("mainRoot")!;
        let backgroundColor: string = window.getComputedStyle(mainRoot).backgroundColor;
        canvas.style.backgroundColor = backgroundColor;

        const worker: Worker = new CanvasWorker();
        worker.postMessage({ backgroundColor: backgroundColor });

        const offscreenCanvas: OffscreenCanvas = canvas.transferControlToOffscreen();
        worker.postMessage({ canvas: offscreenCanvas }, [offscreenCanvas]);

        const resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
            worker.postMessage({ width: canvasDiv.clientWidth, height: canvasDiv.clientHeight });
        });
        resizeObserver.observe(canvasDiv);

        const mutationObserver: MutationObserver = new MutationObserver((mutationList, observer) => {
            backgroundColor = window.getComputedStyle(mainRoot).backgroundColor;
            worker.postMessage({ backgroundColor: backgroundColor });
        });
        mutationObserver.observe(document.documentElement, { attributes: true, childList: true });
    });
</script>

<div class="size-full" id="canvasDiv">
    <canvas bind:this={canvas}>Lorenz system simulation</canvas>
</div>
