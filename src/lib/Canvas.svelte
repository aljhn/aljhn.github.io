<script lang="ts">
    import Header from "./Header.svelte";

    let canvas: HTMLCanvasElement;

    function mmod(n: number, m: number): number {
        return n & (m - 1);
    }

    function mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    function getRandom(low: number, high: number): number {
        return Math.random() * (high - low) + low;
    }

    type Point = {
        x: number;
        y: number;
        z: number;
    };

    function addPoints(p1: Point, p2: Point): void {
        p1.x += p2.x;
        p1.y += p2.y;
        p1.z += p2.z;
        // return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
    }

    function mulPoint(p: Point, scalar: number): void {
        p.x *= scalar;
        p.y *= scalar;
        p.z *= scalar;
        // return { x: p.x * scalar, y: p.y * scalar, z: p.z * scalar };
    }

    function pointNorm(p: Point): number {
        return Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    }

    interface ODE {
        f: (t: number, p: Point) => Point;
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

        f(t: number, p: Point): Point {
            const dx: number = this.sigma * (p.y - p.x);
            const dy: number = p.x * (this.rho - p.z) - p.y;
            const dz: number = p.x * p.y - this.beta * p.z;

            return { x: dx, y: dy, z: dz };
        }
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
        table: ButcherTable;
        system: ODE;

        constructor(table: ButcherTable, system: ODE) {
            this.table = table;
            this.system = system;
        }

        next(t: number, p: Point, h: number): Point {
            let k: Point[] = new Array<Point>(this.table.dim);

            let p_temp: Point = { x: 0, y: 0, z: 0 };

            for (let i = 0; i < this.table.dim; i++) {
                p_temp.x = p.x;
                p_temp.y = p.y;
                p_temp.z = p.z;

                for (let j = 0; j < i; j++) {
                    const s: number = this.table.a[i][j] * h;
                    addPoints(p_temp, { x: k[j].x * s, y: k[j].y * s, z: k[j].z * s });
                }
                k[i] = this.system.f(t + this.table.c[i] * h, p_temp);
            }

            let p_next: Point = { x: p.x, y: p.y, z: p.z };
            for (let i = 0; i < this.table.dim; i++) {
                const s: number = this.table.b[i] * h;
                addPoints(p_next, { x: k[i].x * s, y: k[i].y * s, z: k[i].z * s });
            }
            return p_next;
        }
    }

    class AdaptiveIntegrator {
        table: ButcherTable;
        system: ODE;
        h: number;
        atol: number;
        rtol: number;
        prevNorm1: number;
        prevNorm2: number;

        constructor(table: ButcherTable, system: ODE, atol: number, rtol: number) {
            this.table = table;
            this.system = system;
            this.h = 1e-3;
            this.atol = atol;
            this.rtol = rtol;
            this.prevNorm1 = 1;
            this.prevNorm2 = 1;
        }

        next(t: number, p: Point): Point {
            let k: Point[] = new Array<Point>(this.table.dim);

            let p_temp: Point = { x: 0, y: 0, z: 0 };

            for (let i = 0; i < this.table.dim; i++) {
                p_temp.x = p.x;
                p_temp.y = p.y;
                p_temp.z = p.z;

                for (let j = 0; j < i; j++) {
                    const s: number = this.table.a[i][j] * this.h;
                    addPoints(p_temp, { x: k[j].x * s, y: k[j].y * s, z: k[j].z * s });
                }
                k[i] = this.system.f(t + this.table.c[i] * this.h, p_temp);
            }

            let p_next: Point = { x: p.x, y: p.y, z: p.z };
            for (let i = 0; i < this.table.dim; i++) {
                const s: number = this.table.b[i] * this.h;
                addPoints(p_next, { x: k[i].x * s, y: k[i].y * s, z: k[i].z * s });
            }

            let p_e_next: Point = { x: p.x, y: p.y, z: p.z };
            for (let i = 0; i < this.table.dim; i++) {
                const s: number = this.table.b_e[i] * this.h;
                addPoints(p_next, { x: k[i].x * s, y: k[i].y * s, z: k[i].z * s });
            }

            const error: Point = {x: p_next.x - p_e_next.x, y: p_next.z - p_e_next.x, z: p_next.z - p_e_next.z};
            const tol: number = this.atol + this.rtol * Math.max(0, 0);
            mulPoint(error, 1 / tol);
            const E: number = pointNorm(error);

            this.h = this.h * Math.pow(1 / E, 1 / (this.table.dim + 1));
            this.prevNorm2 = this.prevNorm1;
            this.prevNorm1 = pointNorm(p_next);

            return p_next;
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
            simulator: Integrator
        ): void {
            const p: Point = this.path[this.currentPointIndex];

            const h: number = dt * speedScale;
            const p_next: Point = simulator.next(0, p, h);

            if (this.path.length < this.pathLength) {
                this.path.push(p_next);
                this.currentPointIndex++;
            } else {
                this.currentPointIndex = mod(this.currentPointIndex + 1, this.pathLength);
                this.path[this.currentPointIndex] = p_next;
            }

            const pathLength: number = this.path.length;
            for (let i = 0; i < pathLength - 1; i++) {
                const index1: number = mod(this.currentPointIndex + 1 + i, pathLength);
                const index2: number = mod(this.currentPointIndex + 2 + i, pathLength);

                const alphaCounter: number = mod(index1 - this.currentPointIndex, pathLength);
                const alphaValue: number = alphaCounter / pathLength;

                const deltaX: number = this.path[index2].x - this.path[index1].x;
                const deltaZ: number = this.path[index2].z - this.path[index1].z;
                const angle: number = (Math.atan2(deltaZ, deltaX) * 180) / Math.PI + 180;

                ctx.strokeStyle = "hsla(" + angle + ", 40%, 50%," + alphaValue + ")";
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.moveTo(centerX + this.path[index1].x * scaleX, centerY - this.path[index1].z * scaleY);
                ctx.lineTo(centerX + this.path[index2].x * scaleX, centerY - this.path[index2].z * scaleY);
                ctx.stroke();
            }
        }
    }

    $effect(() => {
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d", { alpha: false })!;

        const mainRoot: HTMLElement = document.getElementById("mainRoot")!;
        const canvasDiv: HTMLElement = document.getElementById("canvasDiv")!;

        const x0: number = 0.0;
        const y0: number = 1.0;
        const z0: number = 1.05;

        const rho: number = 28;
        const sigma: number = 10;
        const beta: number = 8 / 3;

        const system: ODE = new Lorenz(sigma, rho, beta);

        const table: ButcherTable = new Euler();
        const simulator: Integrator = new Integrator(table, system);

        // const table: ButcherTable = new Dopri5();
        // const atol: number = 1e-8;
        // const rtol: number = 1e-3;
        // const simulator: AdaptiveIntegrator = new AdaptiveIntegrator(table, system, atol, rtol);

        const boundingBoxX0: number = -40;
        const boundingBoxX1: number = 40;
        const boundingBoxY0: number = -10;
        const boundingBoxY1: number = 60;

        const maxPoints: number = 60;
        const particleAmount = 50;

        let particles: Particle[] = new Array<Particle>(particleAmount);
        for (let i = 0; i < particleAmount; i++) {
            const initialPoint: Point = {
                x: x0 + getRandom(-10, 10),
                y: y0 + getRandom(-10, 10),
                z: z0 + getRandom(-10, 10)
            };
            particles[i] = new Particle(initialPoint, maxPoints);
        }

        const speedScale: number = 0.4;

        let lastTimestamp: DOMHighResTimeStamp = 0;

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
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update(ctx, centerX, centerY, scaleX, scaleY, speedScale, dt, simulator);
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
