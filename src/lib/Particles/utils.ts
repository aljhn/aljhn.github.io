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

function getNextHueRangeTarget(): number {
    return sampleLogNormal(4, 0.5);
}

function getNextSaturationTarget(): number {
    return sampleUniform(60.0, 80.0);
}

function getNextLightTarget(darkMode: boolean): number {
    if (darkMode) {
        return sampleUniform(60.0, 80.0);
    } else {
        return sampleUniform(20.0, 40.0);
    }
}

function getHuePositionChange(): number {
    return sampleNormal(50.0, 15.0);
}

function getHueRotationChange(): number {
    return sampleNormal(30.0, 10.0);
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

class Heun implements Integrator {
    k1: THREE.Vector3;
    k2: THREE.Vector3;

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

export {
    RAD2DEG,
    sampleUniform,
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
    Heun
};

export type { ODE, Integrator };
