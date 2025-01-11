<script lang="ts">
    import Header from "./Header.svelte";

    let canvas: HTMLCanvasElement;

    function mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    function getRandom(low: number, high: number): number {
        return Math.random() * (high - low) + low;
    }

    function lorenz(t: number, p: Point, args: number[]): Point {
        const [sigma, rho, beta]: number[] = args;

        const dx: number = sigma * (p.y - p.x);
        const dy: number = p.x * (rho - p.z) - p.y;
        const dz: number = p.x * p.y - beta * p.z;

        return new Point(dx, dy, dz);
    }

    class ButcherTable {
        a: number[][];
        b: number[];
        c: number[];
        b_e: number[] | null;
        dim: number;

        constructor(a: number[][], b: number[], c: number[], b_e: number[] | null = null) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.b_e = b_e;
            this.dim = b.length;
        }
    }

    class Euler extends ButcherTable {
        constructor() {
            const a: number[][] = [[0]];
            const b: number[] = [1];
            const c: number[] = [0];
            super(a, b, c);
        }
    }

    class RK4 extends ButcherTable {
        constructor() {
            const a: number[][] = [
                [0, 0, 0, 0],
                [1 / 2, 0, 0, 0],
                [0, 1 / 2, 0, 0],
                [0, 0, 1, 0]
            ];
            const b: number[] = [1 / 6, 1 / 3, 1 / 3, 1 / 6];
            const c: number[] = [0, 1 / 2, 1 / 2, 1];
            super(a, b, c);
        }
    }

    class Dopri5 extends ButcherTable {
        constructor() {
            const a: number[][] = [
                [0, 0, 0, 0, 0, 0],
                [1 / 5, 0, 0, 0, 0, 0],
                [3 / 40, 9 / 40, 0, 0, 0, 0],
                [44 / 45, -56 / 15, 32 / 9, 0, 0, 0],
                [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729, 0, 0],
                [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656, 0],
                [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]
            ];
            const b: number[] = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0];
            const b_e: number[] = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40];
            const c: number[] = [0, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1];
            super(a, b, c, b_e);
        }
    }

    class Integrator {
        system: Function;
        args: number[];
        table: ButcherTable;

        constructor(table: ButcherTable, system: Function, args: number[]) {
            this.system = system;
            this.args = args;
            this.table = table;
        }

        next(t: number, p: Point, h: number): Point {
            let k: Point[] = new Array(this.table.dim);

            let p_temp: Point = new Point();

            for (let i = 0; i < this.table.dim; i++) {
                p_temp.x = p.x;
                p_temp.y = p.y;
                p_temp.z = p.z;

                for (let j = 0; j < i; j++) {
                    p_temp = addPoints(p_temp, mulPoint(k[j], this.table.a[i][j] * h));
                }
                k[i] = this.system(t + this.table.c[i] * h, p_temp, this.args);
            }

            let p_next: Point = new Point(p.x, p.y, p.z);
            for (let i = 0; i < this.table.dim; i++) {
                p_next = addPoints(p_next, mulPoint(k[i], this.table.b[i] * h));
            }
            return p_next;
        }
    }

    class AdaptiveIntegrator {
        system: Function;
        args: number[];
        table: ButcherTable;
        h: number;
        atol: number;
        rtol: number;
        prevNorm1: number;
        prevNorm2: number;

        constructor(table: ButcherTable, system: Function, args: number[], atol: number, rtol: number) {
            this.system = system;
            this.args = args;
            this.table = table;
            this.h = 1e-3;
            this.atol = atol;
            this.rtol = rtol;
            this.prevNorm1 = 1;
            this.prevNorm2 = 1;
        }

        next(t: number, p: Point): Point {
            let k: Point[] = new Array(this.table.dim);

            let p_temp: Point = new Point();

            for (let i = 0; i < this.table.dim; i++) {
                p_temp.x = p.x;
                p_temp.y = p.y;
                p_temp.z = p.z;

                for (let j = 0; j < i; j++) {
                    p_temp = addPoints(p_temp, mulPoint(k[j], this.table.a[i][j] * this.h));
                }
                k[i] = this.system(t + this.table.c[i] * this.h, p_temp, this.args);
            }

            let p_next: Point = new Point(p.x, p.y, p.z);
            for (let i = 0; i < this.table.dim; i++) {
                p_next = addPoints(p_next, mulPoint(k[i], this.table.b[i] * this.h));
            }

            let p_e_next: Point = new Point(p.x, p.y, p.z);
            for (let i = 0; i < this.table.dim; i++) {
                p_e_next = addPoints(p_e_next, mulPoint(k[i], this.table.b_e[i] * this.h));
            }

            const error: Point = addPoints(p_next, mulPoint(p_e_next, -1));
            const tol: number = this.atol + this.rtol * Math.max(0, 0);
            const E: number = pointNorm(mulPoint(error, 1 / tol));

            this.h = this.h * Math.pow(1 / E, 1 / (this.table.dim + 1));
            this.prevNorm2 = this.prevNorm1;
            this.prevNorm1 = pointNorm(p_next);

            return p_next;
        }
    }

    class Point {
        x: number;
        y: number;
        z: number;

        constructor(x: number = 0, y: number = 0, z: number = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    function addPoints(p1: Point, p2: Point): Point {
        return new Point(p1.x + p2.x, p1.y + p2.y, p1.z + p2.z);
    }

    function mulPoint(p: Point, scalar: number): Point {
        return new Point(p.x * scalar, p.y * scalar, p.z * scalar);
    }

    function pointNorm(p: Point): number {
        return Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
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
            simulator: Integrator
        ): void {
            const p: Point = this.path[this.currentPointIndex];

            const h: number = dt * speedScale;
            // const p_next: Point = simulator.next(0, p, h);
            const p_next: Point = addPoints(p, mulPoint(simulator.system(0, p, simulator.args), h));

            if (this.path.length < this.pathLength) {
                this.path.push(p_next);
                this.currentPointIndex++;
            } else {
                this.currentPointIndex = mod(this.currentPointIndex + 1, this.pathLength);
                this.path[this.currentPointIndex] = p_next; // TODO: insert everything inplace instead of so many allocations
            }

            // const index1: number = mod(this.currentPointIndex - 1, this.path.length);
            // const index2: number = this.currentPointIndex;
            // const deltaX: number = this.path[index2].x - this.path[index1].x;
            // const deltaZ: number = this.path[index2].z - this.path[index1].z;
            // const angle: number = (Math.atan2(deltaZ, deltaX) * 180) / Math.PI + 180;
            // ctx.fillStyle = "hsl(" + angle + ", 40%, 50%)";
            // ctx.beginPath();
            // ctx.arc(
            //     centerX + this.path[this.currentPointIndex].x * scaleX,
            //     centerY - this.path[this.currentPointIndex].z * scaleY,
            //     3,
            //     0,
            //     2 * Math.PI
            // );
            // ctx.fill();

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
            const x0: number = 0.0;
            const y0: number = 1.0;
            const z0: number = 1.05;

            const rho: number = 28;
            const sigma: number = 10;
            const beta: number = 8 / 3;
            const args: number[] = [sigma, rho, beta];

            const system: Function = lorenz;

            // const table: ButcherTable = new RK4();
            const table: ButcherTable = new Euler();
            const simulator: Integrator = new Integrator(table, system, args);
            // const table: ButcherTable = new Dopri5();
            // const atol: number = 1e-8;
            // const rtol: number = 1e-3;
            // const simulator: AdaptiveIntegrator = new AdaptiveIntegrator(table, system, args, atol, rtol);

            const boundingBoxX0: number = -40;
            const boundingBoxX1: number = 40;
            const boundingBoxY0: number = -10;
            const boundingBoxY1: number = 60;

            const maxPoints: number = 50;
            const particleAmount = 50;

            let particles: Particle[] = [];
            for (let i = 0; i < particleAmount; i++) {
                const initialPoint: Point = new Point(
                    x0 + getRandom(-10, 10),
                    y0 + getRandom(-10, 10),
                    z0 + getRandom(-10, 10)
                );
                particles.push(new Particle(initialPoint, maxPoints));
            }

            const speedScale: number = 0.3;

            const canvasDiv = document.getElementById("canvasDiv");

            let lastTimestamp: DOMHighResTimeStamp = 0;

            function draw(timestamp: DOMHighResTimeStamp): void {
                const dt: number = (timestamp - lastTimestamp) / 1000;

                if (ctx != null && canvas != null && canvasDiv != null) {
                    const darkMode: boolean = document.documentElement.classList.contains("dark");

                    const bgColorRaw: string = darkMode
                        ? getComputedStyle(document.body).getPropertyValue("--color-surface-800")
                        : getComputedStyle(document.body).getPropertyValue("--color-surface-100");

                    const backgroundColor = bgColorRaw
                        .split(" ")
                        .map((x) => parseInt(x).toString(16))
                        .map((x) => (x.length === 1 ? "0" + x : x))
                        .reduce((acc, x) => acc + x, "#");

                    canvas.width = canvasDiv.clientWidth;
                    canvas.height = canvasDiv.clientHeight;

                    const scaleX: number = canvas.width / (boundingBoxX1 - boundingBoxX0);
                    const scaleY: number = canvas.height / (boundingBoxY1 - boundingBoxY0);
                    const centerX: number = canvas.width / 2 + ((boundingBoxX1 + boundingBoxX0) / 2) * scaleX;
                    const centerY: number = canvas.height / 2 + ((boundingBoxY1 + boundingBoxY0) / 2) * scaleY;

                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    if (dt <= 0.1) {
                        for (let i = 0; i < particles.length; i++) {
                            particles[i].update(ctx, centerX, centerY, scaleX, scaleY, speedScale, dt, simulator);
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
