<script lang="ts">
    let canvas: HTMLCanvasElement;

    function mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    function getRandom(low: number, high: number): number {
        return Math.random() * (high - low) + low;
    }

    const RAD2DEG: number = 180 / Math.PI;

    interface ODE {
        f: (t: number, x: number, y: number, z: number) => [number, number, number];
    }

    class Lorenz implements ODE {
        sigma: number;
        rho: number;
        beta: number;

        constructor(sigma: number, rho: number, beta: number) {
            this.sigma = sigma;
            this.rho = rho;
            this.beta = beta;
        }

        f(t: number, x: number, y: number, z: number): [number, number, number] {
            const dx: number = this.sigma * (y - x);
            const dy: number = x * (this.rho - z) - y;
            const dz: number = x * y - this.beta * z;
            return [dx, dy, dz];
        }
    }

    class Particle {
        system: ODE;
        pathX: Float32Array;
        pathY: Float32Array;
        pathZ: Float32Array;
        currentIndex: number;
        currentX: number;
        currentY: number;
        currentZ: number;

        constructor(system: ODE, x0: number, y0: number, z0: number, pathLength: number) {
            this.system = system;
            this.pathX = new Float32Array(pathLength);
            this.pathY = new Float32Array(pathLength);
            this.pathZ = new Float32Array(pathLength);
            this.pathX[0] = x0;
            this.pathY[0] = y0;
            this.pathZ[0] = z0;
            this.currentIndex = 0;
            this.currentX = x0;
            this.currentY = y0;
            this.currentZ = z0;
        }

        update(h: number): void {
            // const x: number = this.pathX[this.currentIndex];
            // const y: number = this.pathY[this.currentIndex];
            // const z: number = this.pathZ[this.currentIndex];
            //
            // const [dx, dy, dz]: [number, number, number] = this.system.f(0, x, y, z);
            //
            // const nextIndex: number = mod(this.currentIndex + 1, this.pathX.length);
            // this.pathX[nextIndex] = x + dx * h;
            // this.pathY[nextIndex] = y + dy * h;
            // this.pathZ[nextIndex] = z + dz * h;
            // this.currentIndex = nextIndex;

            const x: number = this.currentX;
            const y: number = this.currentY;
            const z: number = this.currentZ;

            const [dx, dy, dz]: [number, number, number] = this.system.f(0, x, y, z);

            this.currentX = x + dx * h;
            this.currentY = y + dy * h;
            this.currentZ = z + dz * h;

            const distSquared: number =
                (this.currentX - this.pathX[this.currentIndex]) * (this.currentX - this.pathX[this.currentIndex]) +
                (this.currentY - this.pathY[this.currentIndex]) * (this.currentY - this.pathY[this.currentIndex]) +
                (this.currentZ - this.pathZ[this.currentIndex]) * (this.currentZ - this.pathZ[this.currentIndex]);

            if (distSquared > 0.01) {
                this.currentIndex = mod(this.currentIndex + 1, this.pathX.length);
                this.pathX[this.currentIndex] = this.currentX;
                this.pathY[this.currentIndex] = this.currentY;
                this.pathZ[this.currentIndex] = this.currentZ;
            }
        }

        draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scaleX: number, scaleY: number): void {
            const pathLength: number = this.pathX.length;
            for (let i = 0; i < pathLength - 1; i++) {
                const index1: number = mod(this.currentIndex + 1 + i, pathLength);
                const index2: number = mod(this.currentIndex + 2 + i, pathLength);

                const alpha: number = mod(index1 - this.currentIndex, pathLength) / pathLength;

                const deltaX: number = this.pathX[index2] - this.pathX[index1];
                const deltaZ: number = this.pathZ[index2] - this.pathZ[index1];
                const angle: number = Math.atan2(deltaZ, deltaX) * RAD2DEG + 180;

                ctx.strokeStyle = `hsla(${angle}, 40%, 50%, ${alpha})`;

                ctx.beginPath();
                ctx.moveTo(centerX + this.pathX[index1] * scaleX, centerY - this.pathZ[index1] * scaleY);
                ctx.lineTo(centerX + this.pathX[index2] * scaleX, centerY - this.pathZ[index2] * scaleY);
                ctx.stroke();
            }
        }
    }

    $effect(() => {
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

        const mainRoot: HTMLElement = document.getElementById("mainRoot")!;
        const canvasDiv: HTMLElement = document.getElementById("canvasDiv")!;

        const x0: number = 0.0;
        const y0: number = 1.0;
        const z0: number = 1.05;

        const rho: number = 28;
        const sigma: number = 10;
        const beta: number = 8 / 3;

        const system: ODE = new Lorenz(sigma, rho, beta);

        const boundingBoxX0: number = -40;
        const boundingBoxX1: number = 40;
        const boundingBoxY0: number = -10;
        const boundingBoxY1: number = 60;

        const maxPoints: number = 50;
        const particleAmount: number = 50;

        const particles: Particle[] = Array.from({ length: particleAmount }, () => {
            return new Particle(
                system,
                x0 + getRandom(-10, 10),
                y0 + getRandom(-10, 10),
                z0 + getRandom(-10, 10),
                maxPoints
            );
        });

        ctx.lineWidth = 2;

        const speedScale: number = 0.4;

        let lastTimestamp: DOMHighResTimeStamp = performance.now();

        function draw(timestamp: DOMHighResTimeStamp): void {
            const dt: number = (timestamp - lastTimestamp) / 1000;

            canvas.width = canvasDiv.clientWidth;
            canvas.height = canvasDiv.clientHeight;

            const scaleX: number = canvas.width / (boundingBoxX1 - boundingBoxX0);
            const scaleY: number = canvas.height / (boundingBoxY1 - boundingBoxY0);
            const centerX: number = canvas.width / 2 + ((boundingBoxX1 + boundingBoxX0) / 2) * scaleX;
            const centerY: number = canvas.height / 2 + ((boundingBoxY1 + boundingBoxY0) / 2) * scaleY;

            const backgroundColor: string = window.getComputedStyle(mainRoot).backgroundColor;
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (dt <= 0.1) {
                const h: number = dt * speedScale;
                for (const particle of particles) {
                    particle.update(h);
                    particle.draw(ctx, centerX, centerY, scaleX, scaleY);
                }
            }

            lastTimestamp = timestamp;
            requestAnimationFrame(draw);
        }

        requestAnimationFrame(draw);
    });
</script>

<div class="size-full" id="canvasDiv">
    <canvas bind:this={canvas}></canvas>
</div>
