<script lang="ts">
    let canvas: HTMLCanvasElement;

    function mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    function getRandom(low: number, high: number) {
        return Math.random() * (high - low) + low;
    }

    class Point {
        x: number;
        y: number;
        z: number;

        constructor(x: number, y: number, z: number) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    class Particle {
        path: Point[];
        pathLength: number;
        currentPointIndex: number = 0;

        constructor(initialPoint: Point, pathLength: number) {
            this.path = [initialPoint];
            this.pathLength = pathLength;
        }

        update(
            ctx: CanvasRenderingContext2D,
            centerX: number,
            centerY: number,
            scaleX: number,
            scaleY: number,
            speedScale: number,
            dt: number,
            sigma: number,
            rho: number,
            beta: number
        ) {
            const x: number = this.path[this.currentPointIndex].x;
            const y: number = this.path[this.currentPointIndex].y;
            const z: number = this.path[this.currentPointIndex].z;

            const dx: number = sigma * (y - x);
            const dy: number = x * (rho - z) - y;
            const dz: number = x * y - beta * z;

            const nextX: number = x + dx * dt * speedScale;
            const nextY: number = y + dy * dt * speedScale;
            const nextZ: number = z + dz * dt * speedScale;

            if (this.path.length < this.pathLength) {
                this.path.push(new Point(nextX, nextY, nextZ));
                this.currentPointIndex++;
            } else {
                this.currentPointIndex = mod(this.currentPointIndex + 1, this.pathLength);
                this.path[this.currentPointIndex].x = nextX;
                this.path[this.currentPointIndex].y = nextY;
                this.path[this.currentPointIndex].z = nextZ;
            }

            const index1: number = mod(this.currentPointIndex - 1, this.path.length);
            const index2: number = this.currentPointIndex;
            const deltaX: number = this.path[index2].x - this.path[index1].x;
            const deltaZ: number = this.path[index2].z - this.path[index1].z;
            const angle: number = (Math.atan2(deltaZ, deltaX) * 180) / Math.PI + 180;
            ctx.fillStyle = "hsl(" + angle + ", 40%, 50%)";
            ctx.beginPath();
            ctx.arc(
                centerX + this.path[this.currentPointIndex].x * scaleX,
                centerY - this.path[this.currentPointIndex].z * scaleY,
                3,
                0,
                2 * Math.PI
            );
            ctx.fill();

            for (let i = 0; i < this.path.length - 1; i++) {
                const index1: number = mod(this.currentPointIndex + 1 + i, this.path.length);
                const index2: number = mod(this.currentPointIndex + 2 + i, this.path.length);

                const alphaCounter: number = mod(index1 - this.currentPointIndex, this.path.length);
                const alphaValue: number = Math.pow(alphaCounter / this.path.length, 2);

                const deltaX: number = this.path[index2].x - this.path[index1].x;
                const deltaZ: number = this.path[index2].z - this.path[index1].z;
                const angle: number = (Math.atan2(deltaZ, deltaX) * 180) / Math.PI + 180;

                ctx.strokeStyle = "hsla(" + angle + ", 40%, 50%," + alphaValue + ")";
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.moveTo(centerX + this.path[index1].x * scaleX, centerY - this.path[index1].z * scaleY);
                ctx.lineTo(centerX + this.path[index2].x * scaleX, centerY - this.path[index2].z * scaleY);
                ctx.stroke();
            }
        }
    }

    $effect(() => {
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (ctx != null) {
            const backgroundColor: string = "#222222";
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const x0: number = 0.0;
            const y0: number = 1.0;
            const z0: number = 1.05;

            const rho: number = 28;
            const sigma: number = 10;
            const beta: number = 8 / 3;

            const boundingBoxX0: number = -50;
            const boundingBoxX1: number = 50;
            const boundingBoxY0: number = -10;
            const boundingBoxY1: number = 60;

            const maxPoints: number = 50;
            const particleAmount = 50;

            let particles: Particle[] = [];
            for (let i = 0; i < particleAmount; i++) {
                const initialPoint: Point = new Point(
                    x0 + getRandom(-1, 1),
                    y0 + getRandom(-1, 1),
                    z0 + getRandom(-1, 1)
                );
                particles.push(new Particle(initialPoint, maxPoints));
            }

            const speedScale: number = 0.5;

            const canvasDiv = document.getElementById("canvasDiv");

            let lastTimestamp: DOMHighResTimeStamp = 0;

            function draw(timestamp: DOMHighResTimeStamp) {
                const dt: number = (timestamp - lastTimestamp) / 1000;

                if (ctx != null) {
                    if (canvas != null && canvasDiv != null) {
                        canvas.width = canvasDiv.clientWidth;
                        canvas.height = canvasDiv.clientHeight;
                    }

                    const scaleX: number = canvas.width / (boundingBoxX1 - boundingBoxX0);
                    const scaleY: number = canvas.height / (boundingBoxY1 - boundingBoxY0);
                    const centerX: number = canvas.width / 2 + ((boundingBoxX1 + boundingBoxX0) / 2) * scaleX;
                    const centerY: number = canvas.height / 2 + ((boundingBoxY1 + boundingBoxY0) / 2) * scaleY;

                    ctx.fillStyle = "#222222";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    if (dt <= 0.1) {
                        for (let i = 0; i < particles.length; i++) {
                            particles[i].update(
                                ctx,
                                centerX,
                                centerY,
                                scaleX,
                                scaleY,
                                speedScale,
                                dt,
                                sigma,
                                rho,
                                beta
                            );
                        }
                    }
                }

                lastTimestamp = timestamp;
                requestAnimationFrame(draw);
            }

            requestAnimationFrame(draw);
        }
    });
</script>

<div class="size-full" id="canvasDiv">
    <canvas bind:this={canvas}></canvas>
</div>
