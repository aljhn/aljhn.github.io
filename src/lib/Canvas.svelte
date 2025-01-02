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
            scale: number,
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

            let deltaX: number =
                this.path[this.currentPointIndex].x - this.path[mod(this.currentPointIndex - 1, this.path.length)].x;
            let deltaZ: number =
                this.path[this.currentPointIndex].z - this.path[mod(this.currentPointIndex - 1, this.path.length)].z;
            const angle: number = (Math.atan2(deltaZ, deltaX) * 180) / Math.PI + 180;
            ctx.fillStyle = "hsl(" + angle + ", 40%, 50%)";
            // ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(
                centerX + this.path[this.currentPointIndex].x * scale,
                centerY - this.path[this.currentPointIndex].z * scale,
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

                deltaX = this.path[index2].x - this.path[index1].x;
                deltaZ = this.path[index2].z - this.path[index1].z;
                const angle: number = (Math.atan2(deltaZ, deltaX) * 180) / Math.PI + 180;

                ctx.strokeStyle = "hsla(" + angle + ", 40%, 50%," + alphaValue + ")";
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.moveTo(centerX + this.path[index1].x * scale, centerY - this.path[index1].z * scale);
                ctx.lineTo(centerX + this.path[index2].x * scale, centerY - this.path[index2].z * scale);
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

            const scale: number = 10;
            const centerX: number = canvas.width / 2;
            const centerY: number = canvas.height / 2 + 30 * scale;

            const speedScale: number = 0.5;

            let lastTimestamp: DOMHighResTimeStamp = 0;

            function draw(timestamp: DOMHighResTimeStamp) {
                const dt: number = (timestamp - lastTimestamp) / 1000;

                ctx.fillStyle = "#222222";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                if (dt <= 0.1) {
                    for (let i = 0; i < particles.length; i++) {
                        particles[i].update(ctx, centerX, centerY, scale, speedScale, dt, sigma, rho, beta);
                    }
                }

                lastTimestamp = timestamp;
                requestAnimationFrame(draw);
            }

            requestAnimationFrame(draw);
        }
    });
</script>

<div>
    <canvas bind:this={canvas} width="800" height="600"></canvas>
</div>
