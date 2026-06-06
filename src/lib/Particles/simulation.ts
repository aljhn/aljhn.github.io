import * as THREE from "three";
import type { ODE, Integrator } from "./utils";
import {
    Lorenz,
    Heun,
    getNextHueRangeTarget,
    getNextSaturationTarget,
    getNextLightTarget,
    getHuePositionChange,
    getHueRotationChange,
    shortestAngleDifference,
    sampleUniform,
    getRandomTarget,
    deltaQuaternion
} from "./utils";

export class SimulationState {
    omegaNorm: number;
    omegaChangeSpeed: number;

    omega: THREE.Vector3;
    omegaTarget: THREE.Spherical;
    omegaCurrent: THREE.Spherical;

    colorFrameRotation: THREE.Quaternion;
    dq: THREE.Quaternion;

    hueRange: number;
    hueRangeTarget: number;

    huePosition: number;
    hueRotation: number;

    saturation: number;
    saturationTarget: number;

    light: number;
    lightTarget: number;

    hueRangeChangeFactor: number;
    hueRangeChangeDefault: number;
    huePositionChangeFactor: number;
    hueRotationChangeFactor: number;
    saturationChangeFactor: number;
    lightChangeFactor: number;

    speedScale: number;

    particleAmount: number;

    particlePositions: Float32Array;
    particleVelocities: Float32Array;

    integrateOutput: THREE.Vector3;

    ode: ODE;
    integrator: Integrator;

    constructor(particleAmount: number) {
        this.omegaNorm = 0.1;
        this.omegaChangeSpeed = 2.0;

        this.omega = new THREE.Vector3();
        this.omegaTarget = new THREE.Spherical();
        this.omegaCurrent = new THREE.Spherical(this.omegaNorm, 0.0, 0.0);

        this.colorFrameRotation = new THREE.Quaternion();
        this.dq = new THREE.Quaternion();

        this.hueRange = 20;
        this.hueRangeTarget = getNextHueRangeTarget();

        this.huePosition = sampleUniform(0.0, 360.0);
        this.hueRotation = 0;

        this.saturation = 60;
        this.saturationTarget = getNextSaturationTarget();

        this.light = 50;
        this.lightTarget = 50;

        this.hueRangeChangeFactor = 0.2;
        this.hueRangeChangeDefault = 10.0;
        this.huePositionChangeFactor = 0.05;
        this.hueRotationChangeFactor = 0.1;
        this.saturationChangeFactor = 0.5;
        this.lightChangeFactor = 0.1;

        this.speedScale = 0.2;

        this.particleAmount = particleAmount;

        this.particlePositions = new Float32Array(this.particleAmount * 3);
        this.particleVelocities = new Float32Array(this.particleAmount * 3);

        this.integrateOutput = new THREE.Vector3();

        this.ode = new Lorenz();
        this.integrator = new Heun();
    }

    updateColorFrameRotation(dt: number): void {
        const errorPhi = shortestAngleDifference(this.omegaCurrent.phi, this.omegaTarget.phi);
        const errorTheta = shortestAngleDifference(this.omegaCurrent.theta, this.omegaTarget.theta);

        const errorNormSquared = errorPhi * errorPhi + errorTheta * errorTheta;

        if (errorNormSquared > 1e-3) {
            this.omegaCurrent.phi += errorPhi * this.omegaChangeSpeed * dt;
            this.omegaCurrent.theta += errorTheta * this.omegaChangeSpeed * dt;
        } else {
            getRandomTarget(this.omegaTarget);
        }

        this.omega.setFromSpherical(this.omegaCurrent);

        deltaQuaternion(this.omega, dt, this.dq);
        this.colorFrameRotation.multiply(this.dq);
        this.colorFrameRotation.normalize();
    }

    updateColorValues(dt: number, darkMode: boolean): void {
        if (this.hueRange < this.hueRangeTarget) {
            this.hueRange +=
                ((this.hueRangeTarget - this.hueRange) * this.hueRangeChangeFactor + this.hueRangeChangeDefault) * dt;
            if (this.hueRange >= this.hueRangeTarget) {
                this.hueRangeTarget = getNextHueRangeTarget();
            }
        } else {
            this.hueRange +=
                ((this.hueRangeTarget - this.hueRange) * this.hueRangeChangeFactor - this.hueRangeChangeDefault) * dt;
            if (this.hueRange <= this.hueRangeTarget) {
                this.hueRangeTarget = getNextHueRangeTarget();
            }
        }

        const huePositionChange = getHuePositionChange();
        this.huePosition += huePositionChange * this.huePositionChangeFactor * dt;
        if (this.huePosition >= 360.0) {
            this.huePosition = 0.0;
        }

        const hueRotationChange = getHueRotationChange();
        this.hueRotation += hueRotationChange * this.hueRotationChangeFactor * dt;
        if (this.hueRotation >= 360.0) {
            this.hueRotation = 0.0;
        }

        const saturationError = this.saturationTarget - this.saturation;
        if (Math.abs(saturationError) > 1e-1) {
            this.saturation += saturationError * this.saturationChangeFactor * dt;
        } else {
            this.saturationTarget = getNextSaturationTarget();
        }

        const lightError = this.lightTarget - this.light;
        if (Math.abs(lightError) > 1e-1) {
            this.light += lightError * this.lightChangeFactor * dt;
        } else {
            this.lightTarget = getNextLightTarget(darkMode);
        }
    }

    updateParticles(dt: number): void {
        for (let i = 0; i < this.particleAmount; i++) {
            const particleIndex = i * 3;
            const x = this.particlePositions[particleIndex];
            const y = this.particlePositions[particleIndex + 1];
            const z = this.particlePositions[particleIndex + 2];

            this.ode.f(x, y, z, this.integrateOutput);
            this.particleVelocities[particleIndex] = this.integrateOutput.x;
            this.particleVelocities[particleIndex + 1] = this.integrateOutput.y;
            this.particleVelocities[particleIndex + 2] = this.integrateOutput.z;

            const h = dt * this.speedScale;
            this.integrator.step(x, y, z, this.ode, h, this.integrateOutput);
            this.particlePositions[particleIndex] = this.integrateOutput.x;
            this.particlePositions[particleIndex + 1] = this.integrateOutput.y;
            this.particlePositions[particleIndex + 2] = this.integrateOutput.z;
        }
    }

    update(dt: number, darkMode: boolean): void {
        this.updateColorFrameRotation(dt);
        this.updateColorValues(dt, darkMode);
        this.updateParticles(dt);
    }

    copyTo(dst: SimulationState): void {
        dst.omegaNorm = this.omegaNorm;
        dst.omegaChangeSpeed = this.omegaChangeSpeed;

        dst.omega.x = this.omega.x;
        dst.omega.y = this.omega.y;
        dst.omega.z = this.omega.z;

        dst.omegaTarget.radius = this.omegaTarget.radius;
        dst.omegaTarget.phi = this.omegaTarget.phi;
        dst.omegaTarget.theta = this.omegaTarget.theta;

        dst.omegaCurrent.radius = this.omegaCurrent.radius;
        dst.omegaCurrent.phi = this.omegaCurrent.phi;
        dst.omegaCurrent.theta = this.omegaCurrent.theta;

        dst.colorFrameRotation.w = this.colorFrameRotation.w;
        dst.colorFrameRotation.x = this.colorFrameRotation.x;
        dst.colorFrameRotation.y = this.colorFrameRotation.y;
        dst.colorFrameRotation.z = this.colorFrameRotation.z;

        dst.dq.w = this.dq.w;
        dst.dq.x = this.dq.x;
        dst.dq.y = this.dq.y;
        dst.dq.z = this.dq.z;

        dst.hueRange = this.hueRange;
        dst.hueRangeTarget = this.hueRangeTarget;
        dst.huePosition = this.huePosition;
        dst.hueRotation = this.hueRotation;

        dst.saturation = this.saturation;
        dst.saturationTarget = this.saturationTarget;

        dst.light = this.light;
        dst.lightTarget = this.lightTarget;

        dst.hueRangeChangeFactor = this.hueRangeChangeFactor;
        dst.hueRangeChangeDefault = this.hueRangeChangeDefault;
        dst.huePositionChangeFactor = this.huePositionChangeFactor;
        dst.hueRotationChangeFactor = this.hueRotationChangeFactor;
        dst.saturationChangeFactor = this.saturationChangeFactor;
        dst.lightChangeFactor = this.lightChangeFactor;

        dst.speedScale = this.speedScale;

        dst.particlePositions.set(this.particlePositions);
        dst.particleVelocities.set(this.particleVelocities);

        dst.integrateOutput.x = this.integrateOutput.x;
        dst.integrateOutput.y = this.integrateOutput.y;
        dst.integrateOutput.z = this.integrateOutput.z;
    }
}
