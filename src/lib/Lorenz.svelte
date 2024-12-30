<script lang="ts">
    let canvas: HTMLCanvasElement;

    function mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    $effect(() => {
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (ctx != null) {
            ctx.fillStyle = "#222222";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let x: number = 0.0;
            let y: number = 1.0;
            let z: number = 1.05;

            x += Math.random() * 2 - 1;
            y += Math.random() * 2 - 1;
            z += Math.random() * 2 - 1;

            const rho: number = 28;
            const sigma: number = 10;
            const beta: number = 8 / 3;

            const FPS: number = 60;
            const dt: number = 1 / FPS;
            const interval: number = 1000 * dt;

            const maxPoints: number = 100;
            let pathX: number[] = new Array(maxPoints);
            let pathZ: number[] = new Array(maxPoints);

            let currentPointIndex: number = 0;
            let pointFirstIndex: number = 0;

            let addNewPointCounter: number = 0;
            const addNewPointInterval: number = 2;

            const scale: number = 10;
            const centerX: number = canvas.width / 2;
            const centerY: number = canvas.height / 2 + 30 * scale;

            setInterval(() => {
                ctx.fillStyle = "#222222";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                if (addNewPointCounter % addNewPointInterval == 0) {
                    pathX[currentPointIndex] = x;
                    pathZ[currentPointIndex] = z;
                    currentPointIndex++;
                    if (currentPointIndex >= maxPoints) {
                        currentPointIndex = 0;
                    }
                    if (currentPointIndex <= pointFirstIndex) {
                        pointFirstIndex++;
                        if (pointFirstIndex >= maxPoints) {
                            pointFirstIndex = 0;
                        }
                    }
                }
                addNewPointCounter++;

                let pointIndex: number = pointFirstIndex;
                while (pointIndex != currentPointIndex) {
                    //const alphaCounter = (((pointIndex - currentPointIndex) % maxPoints) + maxPoints) % maxPoints;
                    const alphaCounter: number = mod(pointIndex - currentPointIndex, maxPoints);
                    const alphaValue: number = Math.floor(Math.pow(alphaCounter / maxPoints, 4) * 255);
                    let alpha: string = alphaValue.toString(16);
                    if (alpha.length < 2) {
                        alpha = "0" + alpha;
                    }

                    ctx.strokeStyle = "#ffffff" + alpha;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(centerX + pathX[pointIndex] * scale, centerY - pathZ[pointIndex] * scale);
                    if (pointIndex > 0) {
                        ctx.lineTo(centerX + pathX[pointIndex - 1] * scale, centerY - pathZ[pointIndex - 1] * scale);
                    } else {
                        ctx.lineTo(centerX + pathX[maxPoints - 1] * scale, centerY - pathZ[maxPoints - 1] * scale);
                    }
                    ctx.stroke();

                    pointIndex++;
                    if (pointIndex >= maxPoints) {
                        pointIndex = 0;
                    }
                }

                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(centerX + x * scale, centerY - z * scale, 5, 0, 2 * Math.PI);
                ctx.fill();

                const dx: number = sigma * (y - x);
                const dy: number = x * (rho - z) - y;
                const dz: number = x * y - beta * z;

                x += dx * dt;
                y += dy * dt;
                z += dz * dt;
            }, interval);
        }
    });
</script>


<div class="">
    <canvas bind:this={canvas} width="800" height="600"></canvas>
</div>
