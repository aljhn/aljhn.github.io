import * as THREE from "three";

const RAD2DEG = 180.0 / Math.PI;

function sampleUniform(low: number, high: number): number {
    return Math.random() * (high - low) + low;
}

function sampleStandardNormal(): number {
    const u1 = sampleUniform(1e-6, 1);
    const u2 = sampleUniform(0, 1);

    const r = Math.sqrt(-2 * Math.log(u1));
    const theta = 2 * Math.PI * u2;

    const z0 = r * Math.cos(theta);
    return z0;
}

function sampleNormal(mean: number, std: number): number {
    const z = sampleStandardNormal();
    return mean + std * z;
}

function sampleLogNormal(mean: number, std: number): number {
    return Math.exp(sampleNormal(mean, std));
}

function sampleExponential(mean: number): number {
    const u = Math.random();
    return -mean * Math.log(1.0 - u);
}

function getInitialHuePosition(): number {
    const k = 10.0;
    const sigmoidLike = (x: number) => Math.atan(k * x) / Math.PI + 0.5;

    const notches = [
        { pos: 20, width: 20 },
        { pos: 90, width: 50 },
        { pos: 250, width: 110 }
    ];

    let L = 360.0;
    for (let i = 0; i < notches.length; i++) {
        L -= notches[i].width;
    }

    const u = Math.random();

    let hueValue = L * u;

    for (let i = 0; i < notches.length; i++) {
        let offset = notches[i].pos;
        for (let j = 0; j < i; j++) {
            offset -= notches[j].width;
        }
        hueValue += notches[i].width * sigmoidLike(L * u - offset);
    }

    return hueValue;
}

function getNextHueRangeTarget(): number {
    return sampleExponential(30.0);
}

function getNextSaturationTarget(): number {
    return sampleUniform(60.0, 90.0);
}

function getNextLightTarget(): number {
    return sampleUniform(60.0, 80.0);
}

function getHuePositionChange(): number {
    return sampleLogNormal(1.0, 1.5);
}

function getHueRotationChange(): number {
    return sampleLogNormal(1.5, 1.0);
}

function mod(n: number, d: number): number {
    return ((n % d) + d) % d;
}

function shortestAngleDifference(a: number, b: number): number {
    let difference = b - a;
    while (difference < -Math.PI) {
        difference += Math.PI * 2;
    }
    while (difference > Math.PI) {
        difference -= Math.PI * 2;
    }
    return difference;
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function getRandomTarget(out: THREE.Spherical): void {
    const az = Math.random() * 2.0 * Math.PI;
    const z = Math.random() * 2.0 - 1.0;
    const el = Math.asin(z);
    out.phi = az;
    out.theta = el;
}

function deltaQuaternion(omega: THREE.Vector3, dt: number, dq: THREE.Quaternion): void {
    const omegaLength = omega.length();
    const angle = omegaLength * dt;

    if (angle < 1e-6) {
        dq.identity();
        return;
    }
    const halfAngle = angle * 0.5;
    const s = Math.sin(halfAngle);
    const c = Math.cos(halfAngle);

    const invOmegaLength = 1.0 / omegaLength;
    const nx = omega.x * invOmegaLength;
    const ny = omega.y * invOmegaLength;
    const nz = omega.z * invOmegaLength;

    dq.w = c;
    dq.x = nx * s;
    dq.y = ny * s;
    dq.z = nz * s;
}

interface ODE {
    f: (x: number, y: number, z: number, out: THREE.Vector3) => void;
}

class Lorenz implements ODE {
    rho: number;
    sigma: number;
    beta: number;

    constructor(rho: number = 28.0, sigma: number = 10.0, beta: number = 8.0 / 3.0) {
        this.rho = rho;
        this.sigma = sigma;
        this.beta = beta;
    }

    f(x: number, y: number, z: number, out: THREE.Vector3): void {
        out.x = this.sigma * (y - x);
        out.y = x * (this.rho - z) - y;
        out.z = x * y - this.beta * z;
    }
}

interface Integrator {
    step: (x: number, y: number, z: number, ode: ODE, h: number, out: THREE.Vector3) => void;
}

class Euler implements Integrator {
    private k: THREE.Vector3;

    constructor() {
        this.k = new THREE.Vector3();
    }

    step(x: number, y: number, z: number, ode: ODE, h: number, out: THREE.Vector3): void {
        ode.f(x, y, z, this.k);

        out.x = x + this.k.x * h;
        out.y = y + this.k.y * h;
        out.z = z + this.k.z * h;
    }
}

class Heun implements Integrator {
    private k1: THREE.Vector3;
    private k2: THREE.Vector3;

    constructor() {
        this.k1 = new THREE.Vector3();
        this.k2 = new THREE.Vector3();
    }

    step(x: number, y: number, z: number, ode: ODE, h: number, out: THREE.Vector3): void {
        ode.f(x, y, z, this.k1);

        ode.f(x + this.k1.x * h, y + this.k1.y * h, z + this.k1.z * h, this.k2);

        out.x = x + 0.5 * (this.k1.x + this.k2.x) * h;
        out.y = y + 0.5 * (this.k1.y + this.k2.y) * h;
        out.z = z + 0.5 * (this.k1.z + this.k2.z) * h;
    }
}

interface AdaptiveIntegrator {
    step: (x: number, y: number, z: number, ode: ODE, maxH: number, out: THREE.Vector3) => boolean;

    getLastAcceptedTimestep: () => number;
}

class DoPri5 implements AdaptiveIntegrator {
    absTol: number;
    relTol: number;

    safetyFactor: number;
    maxFactor: number;
    minFactor: number;

    minH: number;
    maxH: number;

    private h: number;
    private lastAcceptedTimestep: number;

    private k: THREE.Vector3[];

    private out4: THREE.Vector3;
    private out5: THREE.Vector3;

    private fsal: THREE.Vector3;
    private hasFSAL: boolean;

    private static readonly INV_SQRT_3 = 1.0 / Math.sqrt(3.0);

    private static readonly butcher_a: Float64Array[] = [
        new Float64Array([0, 0, 0, 0, 0, 0, 0]),
        new Float64Array([1 / 5, 0, 0, 0, 0, 0, 0]),
        new Float64Array([3 / 40, 9 / 40, 0, 0, 0, 0, 0]),
        new Float64Array([44 / 45, -56 / 15, 32 / 9, 0, 0, 0, 0]),
        new Float64Array([19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729, 0, 0, 0]),
        new Float64Array([9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656, 0, 0]),
        new Float64Array([35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0])
    ];

    private static readonly butcher_b5 = new Float64Array([
        35 / 384,
        0,
        500 / 1113,
        125 / 192,
        -2187 / 6784,
        11 / 84,
        0
    ]);

    private static readonly butcher_b4 = new Float64Array([
        5179 / 57600,
        0,
        7571 / 16695,
        393 / 640,
        -92097 / 339200,
        187 / 2100,
        1 / 40
    ]);

    // private static readonly butcher_c = new Float64Array([
    //     0,
    //     1 / 5,
    //     3 / 10,
    //     4 / 5,
    //     8 / 9,
    //     1,
    //     1
    // ]);

    constructor(h0: number, absTol: number = 1e-6, relTol: number = 1e-4) {
        this.h = h0;
        this.lastAcceptedTimestep = this.h;

        this.absTol = absTol;
        this.relTol = relTol;

        this.safetyFactor = 0.9;
        this.maxFactor = 5.0;
        this.minFactor = 1.0 / this.maxFactor;

        this.minH = 1e-5;
        this.maxH = 1e-1;

        this.k = Array.from({ length: 7 }, () => new THREE.Vector3());

        this.out4 = new THREE.Vector3();
        this.out5 = new THREE.Vector3();

        this.fsal = new THREE.Vector3();
        this.hasFSAL = false;
    }

    step(x: number, y: number, z: number, ode: ODE, maxH: number, out: THREE.Vector3): boolean {
        const h = Math.min(this.h, maxH);

        for (let stage = 0; stage < 7; stage++) {
            if (stage === 0 && this.hasFSAL) {
                this.k[0].x = this.fsal.x;
                this.k[0].y = this.fsal.y;
                this.k[0].z = this.fsal.z;
                continue;
            }

            let sx = x;
            let sy = y;
            let sz = z;

            const coeffs = DoPri5.butcher_a[stage];

            for (let j = 0; j < stage; j++) {
                const kj = this.k[j];
                const a = coeffs[j];

                sx += h * a * kj.x;
                sy += h * a * kj.y;
                sz += h * a * kj.z;
            }

            ode.f(sx, sy, sz, this.k[stage]);
        }

        this.out4.x = x;
        this.out4.y = y;
        this.out4.z = z;

        this.out5.x = x;
        this.out5.y = y;
        this.out5.z = z;

        for (let i = 0; i < 7; i++) {
            const b4i = DoPri5.butcher_b4[i];
            const b5i = DoPri5.butcher_b5[i];
            const ki = this.k[i];

            this.out4.x += h * b4i * ki.x;
            this.out4.y += h * b4i * ki.y;
            this.out4.z += h * b4i * ki.z;

            this.out5.x += h * b5i * ki.x;
            this.out5.y += h * b5i * ki.y;
            this.out5.z += h * b5i * ki.z;
        }

        const errorX = this.out5.x - this.out4.x;
        const errorY = this.out5.y - this.out4.y;
        const errorZ = this.out5.z - this.out4.z;

        const scaleX = this.absTol + this.relTol * Math.max(Math.abs(this.out5.x), Math.abs(x));
        const scaleY = this.absTol + this.relTol * Math.max(Math.abs(this.out5.y), Math.abs(y));
        const scaleZ = this.absTol + this.relTol * Math.max(Math.abs(this.out5.z), Math.abs(z));

        const error =
            Math.sqrt((errorX / scaleX) ** 2.0 + (errorY / scaleY) ** 2.0 + (errorZ / scaleZ) ** 2.0) *
            DoPri5.INV_SQRT_3;

        const accept = error <= 1.0;
        if (accept) {
            out.x = this.out5.x;
            out.y = this.out5.y;
            out.z = this.out5.z;
            this.lastAcceptedTimestep = h;

            this.fsal.x = this.k[6].x;
            this.fsal.y = this.k[6].y;
            this.fsal.z = this.k[6].z;
            this.hasFSAL = true;
        } else {
            this.hasFSAL = false;
        }

        const factor = this.safetyFactor * Math.pow(error, -0.2);
        const clampedFactor = Math.min(this.maxFactor, Math.max(this.minFactor, factor));
        this.h *= clampedFactor;
        this.h = Math.min(this.maxH, Math.max(this.minH, this.h));

        return accept;
    }

    getLastAcceptedTimestep(): number {
        return this.lastAcceptedTimestep;
    }
}

export {
    RAD2DEG,
    sampleUniform,
    getInitialHuePosition,
    getNextHueRangeTarget,
    getNextSaturationTarget,
    getNextLightTarget,
    getHuePositionChange,
    getHueRotationChange,
    mod,
    shortestAngleDifference,
    lerp,
    getRandomTarget,
    deltaQuaternion,
    Lorenz,
    Euler,
    Heun,
    DoPri5
};

export type { ODE, Integrator, AdaptiveIntegrator };
