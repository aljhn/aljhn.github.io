function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

function sampleUniform(low: number, high: number): number {
    return Math.random() * (high - low) + low;
}

// Box-Muller transform
function sampleStandardNormal(): number {
    const u1: number = sampleUniform(0, 1);
    const u2: number = sampleUniform(0, 1);

    const r: number = Math.sqrt(-2 * Math.log(u1));
    const theta: number = 2 * Math.PI * u2;

    const z0: number = r * Math.cos(theta);
    // const z1: number = r * Math.sin(theta);
    return z0;
}

function sampleNormal(mean: number, std: number): number {
    const z: number = sampleStandardNormal();
    return mean + std * z;
}

const RAD2DEG: number = 180 / Math.PI;

interface ODE {
    f: (t: number, x: number, y: number, z: number) => [number, number, number];
}

class Lorenz implements ODE {
    rho: number;
    sigma: number;
    beta: number;

    constructor(rho: number, sigma: number, beta: number) {
        this.rho = rho;
        this.sigma = sigma;
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
    x: number;
    y: number;
    z: number;
    currentIndex: number;
    pathX: Float32Array;
    pathY: Float32Array;
    pathZ: Float32Array;

    constructor(system: ODE, x0: number, y0: number, z0: number, pathLength: number) {
        this.system = system;
        this.x = x0;
        this.y = y0;
        this.z = z0;
        this.currentIndex = 0;
        this.pathX = new Float32Array(pathLength);
        this.pathY = new Float32Array(pathLength);
        this.pathZ = new Float32Array(pathLength);

        this.pathX.fill(x0);
        this.pathY.fill(y0);
        this.pathZ.fill(z0);
    }

    update(h: number): void {
        const [dx, dy, dz]: [number, number, number] = this.system.f(0, this.x, this.y, this.z);

        this.x += dx * h;
        this.y += dy * h;
        this.z += dz * h;

        const velSquared: number = dx * dx + dy * dy + dz * dz;
        if (velSquared < 50) {
            this.x += sampleNormal(0.0, 0.1);
            this.y += sampleNormal(0.0, 0.1);
            this.z += sampleNormal(0.0, 0.1);
        }

        const distSquared: number =
            (this.x - this.pathX[this.currentIndex]) * (this.x - this.pathX[this.currentIndex]) +
            (this.y - this.pathY[this.currentIndex]) * (this.y - this.pathY[this.currentIndex]) +
            (this.z - this.pathZ[this.currentIndex]) * (this.z - this.pathZ[this.currentIndex]);

        if (distSquared > 0.01) {
            this.currentIndex = mod(this.currentIndex + 1, this.pathX.length);
            this.pathX[this.currentIndex] = this.x;
            this.pathY[this.currentIndex] = this.y;
            this.pathZ[this.currentIndex] = this.z;
        }
    }

    draw(
        ctx: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        scaleX: number,
        scaleY: number,
        huePosition: number,
        hueRange: number,
        hueRotation: number,
        saturation: number,
        light: number
    ): void {
        const pathLength: number = this.pathX.length;
        for (let i = 0; i < pathLength - 1; i++) {
            const index1: number = mod(this.currentIndex + 1 + i, pathLength);
            const index2: number = mod(this.currentIndex + 2 + i, pathLength);

            const alpha: number = mod(index1 - this.currentIndex, pathLength) / pathLength;
            const alphaValue: number = Math.round(alpha * 100) / 100;

            const deltaX: number = this.pathX[index2] - this.pathX[index1];
            const deltaY: number = this.pathY[index2] - this.pathY[index1];
            const angle: number = Math.atan2(deltaY, deltaX) * RAD2DEG + 180;
            const rotatedAngle: number = mod(Math.floor(angle + hueRotation), 360);
            const halfAngle: number = 360 - 2 * Math.abs(rotatedAngle - 180);
            const hue: number = Math.floor(
                mod(Math.floor((halfAngle / 360) * hueRange + huePosition - hueRange / 2), 360)
            );

            const color: string = `hsla(${hue}, ${saturation}%, ${light}%, ${alphaValue})`;
            // const color: string = `oklch(${light}% ${saturation}% ${hue} / ${alphaValue})`;

            ctx.strokeStyle = color;

            ctx.beginPath();
            ctx.moveTo(centerX + this.pathX[index1] * scaleX, centerY - this.pathZ[index1] * scaleY);
            ctx.lineTo(centerX + this.pathX[index2] * scaleX, centerY - this.pathZ[index2] * scaleY);
            ctx.stroke();
        }
    }
}

function getNextHueRangeTarget(): number {
    return Math.exp(sampleNormal(5, 0.5));
}

function getNextSaturationTarget(): number {
    return sampleUniform(30, 70);
}

function getNextLightTarget(): number {
    return sampleUniform(40, 60);
}

let canvasWidth: number;
let canvasHeight: number;
let ctx: CanvasRenderingContext2D;

let particles: Particle[];

let backgroundColor: string = "#000000";
let lineWidth: number = 4;

let hueRange: number = 90;
let hueRangeTarget: number = getNextHueRangeTarget();

let huePosition: number = 0;
let hueRotation: number = 0;

let saturation: number = 40;
let saturationTarget: number = getNextSaturationTarget();

let light: number = 50;
let lightTarget: number = getNextLightTarget();

const rho: number = 28;
const sigma: number = 10;
const beta: number = 8 / 3;

const system: ODE = new Lorenz(rho, sigma, beta);

const boundingBoxX0: number = -25;
const boundingBoxX1: number = 25;
const boundingBoxY0: number = -10;
const boundingBoxY1: number = 60;

const speedScale: number = 0.3;

function initialize(canvas: HTMLCanvasElement, pathLength: number, particleAmount: number) {
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })!;

    particles = Array.from({ length: particleAmount }, () => {
        return new Particle(system, sampleUniform(-5, 5), sampleUniform(-5, 5), sampleUniform(60, 70), pathLength);
    });

    lastTimestamp = performance.now();
    requestAnimationFrame(draw);
}

let lastTimestamp: DOMHighResTimeStamp = performance.now();

function draw(timestamp: DOMHighResTimeStamp): void {
    const dt: number = (timestamp - lastTimestamp) / 1000;

    const scaleY: number = canvasHeight / (boundingBoxY1 - boundingBoxY0);
    const scaleX = ((boundingBoxY1 - boundingBoxY0) / (boundingBoxX1 - boundingBoxX0)) * scaleY;
    const centerX: number = canvasWidth / 2 + ((boundingBoxX1 + boundingBoxX0) / 2) * scaleX;
    const centerY: number = canvasHeight / 2 + ((boundingBoxY1 + boundingBoxY0) / 2) * scaleY;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.lineWidth = lineWidth;

    if (dt <= 0.05) {
        const h: number = dt * speedScale;

        if (hueRange < hueRangeTarget) {
            hueRange += ((hueRangeTarget - hueRange) * 0.5 + 10) * h;
            if (hueRange >= hueRangeTarget) {
                hueRangeTarget = getNextHueRangeTarget();
            }
        } else {
            hueRange += ((hueRangeTarget - hueRange) * 0.5 - 10) * h;
            if (hueRange <= hueRangeTarget) {
                hueRangeTarget = getNextHueRangeTarget();
            }
        }

        const huePositionChange: number = sampleNormal(50, 15);
        huePosition += huePositionChange * h;
        if (huePosition >= 360) {
            huePosition = 0;
        }

        const hueRotationChange: number = sampleNormal(30, 10);
        hueRotation += hueRotationChange * h;
        if (hueRotation >= 360) {
            hueRotation = 0;
        }

        if (saturation < saturationTarget) {
            saturation += 10 * h;
            if (saturation >= saturationTarget) {
                saturationTarget = getNextSaturationTarget();
            }
        } else {
            saturation -= 10 * h;
            if (saturation <= saturationTarget) {
                saturationTarget = getNextSaturationTarget();
            }
        }

        if (light < lightTarget) {
            light += 10 * h;
            if (light >= lightTarget) {
                lightTarget = getNextLightTarget();
            }
        } else {
            light -= 10 * h;
            if (light <= lightTarget) {
                lightTarget = getNextLightTarget();
            }
        }

        for (const particle of particles) {
            particle.update(h);
            particle.draw(
                ctx,
                centerX,
                centerY,
                scaleX,
                scaleY,
                huePosition,
                hueRange,
                hueRotation,
                Math.floor(saturation),
                Math.floor(light)
            );
        }
    }

    lastTimestamp = timestamp;
    requestAnimationFrame(draw);
}

let canvas: HTMLCanvasElement | undefined = undefined;

self.onmessage = (event: MessageEvent) => {
    if (event.data.width != undefined && event.data.height != undefined) {
        if (canvas !== undefined) {
            canvas.width = event.data.width;
            canvas.height = event.data.height;
        }
        canvasWidth = event.data.width;
        canvasHeight = event.data.height;
    } else if (event.data.backgroundColor != undefined) {
        backgroundColor = event.data.backgroundColor;
    } else if (event.data.canvas != undefined) {
        canvas = event.data.canvas;

        if (canvas !== undefined) {
            let pathLength: number = 0;
            let particleAmount: number = 0;

            if (canvas.width > 1024 && canvas.height > 800) {
                pathLength = 70;
                particleAmount = 40;
                lineWidth = 4;
            } else {
                pathLength = 30;
                particleAmount = 30;
                lineWidth = 2;
            }

            initialize(canvas, pathLength, particleAmount);
        }
    }
};

export {};
