<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
        k: THREE.Vector3;

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

    function sampleUniform(low: number, high: number): number {
        return Math.random() * (high - low) + low;
    }

    function sampleStandardNormal(): number {
        const u1 = sampleUniform(1e-6, 1);
        const u2 = sampleUniform(0, 1);

        const r = Math.sqrt(-2 * Math.log(u1));
        const theta = 2 * Math.PI * u2;

        const z0 = r * Math.cos(theta);
        // const z1 = r * Math.sin(theta);
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

    const RAD2DEG = 180.0 / Math.PI;

    function mod(n: number, d: number): number {
        return ((n % d) + d) % d;
    }

    function shortestAngleDifference(a: number, b: number): number {
        // return Math.atan2(Math.sin(b - a), Math.cos(b - a));
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

    class SimulationState {
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
            for (let i = 0; i < this.particleAmount; i++) {
                const index = i * 3;
                this.particlePositions[index] = sampleUniform(-5.0, 5.0);
                this.particlePositions[index + 1] = sampleUniform(-5.0, 5.0);
                this.particlePositions[index + 2] = sampleUniform(80.0, 100.0);
            }

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
                    ((this.hueRangeTarget - this.hueRange) * this.hueRangeChangeFactor + this.hueRangeChangeDefault) *
                    dt;
                if (this.hueRange >= this.hueRangeTarget) {
                    this.hueRangeTarget = getNextHueRangeTarget();
                }
            } else {
                this.hueRange +=
                    ((this.hueRangeTarget - this.hueRange) * this.hueRangeChangeFactor - this.hueRangeChangeDefault) *
                    dt;
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

    class Renderer {
        particleAmount: number;
        trailAmount: number;
        ribbonWidth: number;

        camera: THREE.PerspectiveCamera;
        scene: THREE.Scene;
        threeRenderer: THREE.WebGLRenderer;
        controls: OrbitControls;

        vertices: Float32Array;
        indexes: Uint32Array;
        colors: Float32Array;

        geometry: THREE.BufferGeometry;
        material: THREE.MeshBasicMaterial;
        mesh: THREE.Mesh;

        positionAttribute: THREE.BufferAttribute;
        colorAttribute: THREE.BufferAttribute;

        aspectRatio: number;

        cameraDir: THREE.Vector3;
        meshNormalMatrix: THREE.Matrix3;
        meshNormalMatrixTransposed: THREE.Matrix3;

        backgroundColor: THREE.Color;

        currentStartIndex: number;

        colorHSL: THREE.Color;
        colorRGB: THREE.Vector3;

        velocityHueFactor: number;

        alphaRamp: Float32Array;

        qSlerped: THREE.Quaternion;

        constructor(particleAmount: number, trailAmount: number, ribbonWidth: number) {
            this.particleAmount = particleAmount;
            this.trailAmount = trailAmount;
            this.ribbonWidth = ribbonWidth;

            const FOV = 60;
            this.camera = new THREE.PerspectiveCamera(FOV, canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
            this.camera.position.set(0, 0, 100);
            this.camera.lookAt(0, 0, 0);

            this.scene = new THREE.Scene();

            this.threeRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

            this.controls = new OrbitControls(this.camera, canvas);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.1;

            this.vertices = new Float32Array(2 * this.particleAmount * this.trailAmount * 3);
            this.indexes = new Uint32Array(2 * this.particleAmount * this.trailAmount * 3);
            const maxIndex = this.trailAmount * 2;
            for (let i = 0; i < this.particleAmount; i++) {
                for (let j = 0; j < this.trailAmount; j++) {
                    const insertIndex = (i * this.trailAmount + j) * 6;
                    const index = j * 2;
                    const indexOffset = i * maxIndex;

                    this.indexes[insertIndex] = (index % maxIndex) + indexOffset;
                    this.indexes[insertIndex + 1] = ((index + 1) % maxIndex) + indexOffset;
                    this.indexes[insertIndex + 2] = ((index + 2) % maxIndex) + indexOffset;

                    this.indexes[insertIndex + 3] = ((index + 1) % maxIndex) + indexOffset;
                    this.indexes[insertIndex + 4] = ((index + 3) % maxIndex) + indexOffset;
                    this.indexes[insertIndex + 5] = ((index + 2) % maxIndex) + indexOffset;
                }
            }

            this.colors = new Float32Array(2 * this.particleAmount * this.trailAmount * 4);

            this.geometry = new THREE.BufferGeometry();
            this.geometry.setAttribute("position", new THREE.BufferAttribute(this.vertices, 3));
            this.geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 4));
            this.geometry.setIndex(new THREE.BufferAttribute(this.indexes, 1));

            this.material = new THREE.MeshBasicMaterial({
                vertexColors: true,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.scene.add(this.mesh);

            this.positionAttribute = this.mesh.geometry.getAttribute("position");
            this.positionAttribute.setUsage(THREE.DynamicDrawUsage);

            this.colorAttribute = this.mesh.geometry.getAttribute("color");
            this.colorAttribute.setUsage(THREE.DynamicDrawUsage);

            this.threeRenderer.render(this.scene, this.camera);

            this.aspectRatio = 1.0;

            this.cameraDir = new THREE.Vector3();
            this.meshNormalMatrix = new THREE.Matrix3();
            this.meshNormalMatrixTransposed = new THREE.Matrix3();

            this.backgroundColor = new THREE.Color();

            this.currentStartIndex = 0;

            this.colorHSL = new THREE.Color();
            this.colorRGB = new THREE.Vector3();

            this.velocityHueFactor = 0.0001;

            this.alphaRamp = new Float32Array(this.trailAmount);
            for (let j = 0; j < this.trailAmount; j++) {
                const alpha = j / (this.trailAmount - 1);
                this.alphaRamp[j] = Math.pow(alpha, 3.0);
            }

            this.qSlerped = new THREE.Quaternion();
        }

        initializeVertices(simulationState: SimulationState): void {
            const particlePositions = simulationState.particlePositions;

            for (let i = 0; i < this.particleAmount; i++) {
                for (let j = 0; j < this.trailAmount; j++) {
                    let vertexIndex = (i * this.trailAmount + j) * 6;
                    let positionIndex = i * 3;

                    this.vertices[vertexIndex] = particlePositions[positionIndex];
                    this.vertices[vertexIndex + 1] = particlePositions[positionIndex + 1];
                    this.vertices[vertexIndex + 2] = particlePositions[positionIndex + 2];

                    this.vertices[vertexIndex + 3] = particlePositions[positionIndex];
                    this.vertices[vertexIndex + 4] = particlePositions[positionIndex + 1];
                    this.vertices[vertexIndex + 5] = particlePositions[positionIndex + 2];
                }
            }

            this.geometry.computeBoundingBox();
            this.geometry.computeBoundingSphere();
        }

        resize(width: number, height: number): void {
            this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.threeRenderer.setSize(width, height, false);

            this.aspectRatio = width / height;

            this.camera.aspect = this.aspectRatio;
            this.camera.updateProjectionMatrix();
        }

        updateVertices(
            simulationStateCurrent: SimulationState,
            simulationStatePrevious: SimulationState,
            interpolateAlpha: number
        ) {
            const particlePositionsCurrent = simulationStateCurrent.particlePositions;
            const particlePositionsPrevious = simulationStatePrevious.particlePositions;

            const particleVelocitiesCurrent = simulationStateCurrent.particleVelocities;
            const particleVelocitiesPrevious = simulationStatePrevious.particleVelocities;

            for (let i = 0; i < this.particleAmount; i++) {
                const particleIndex = i * 3;

                const xCurrent = particlePositionsCurrent[particleIndex];
                const yCurrent = particlePositionsCurrent[particleIndex + 1];
                const zCurrent = particlePositionsCurrent[particleIndex + 2];

                const xPrevious = particlePositionsPrevious[particleIndex];
                const yPrevious = particlePositionsPrevious[particleIndex + 1];
                const zPrevious = particlePositionsPrevious[particleIndex + 2];

                const x = lerp(xPrevious, xCurrent, interpolateAlpha);
                const y = lerp(yPrevious, yCurrent, interpolateAlpha);
                const z = lerp(zPrevious, zCurrent, interpolateAlpha);

                const dxCurrent = particleVelocitiesCurrent[particleIndex];
                const dyCurrent = particleVelocitiesCurrent[particleIndex + 1];
                const dzCurrent = particleVelocitiesCurrent[particleIndex + 2];

                const dxPrevious = particleVelocitiesPrevious[particleIndex];
                const dyPrevious = particleVelocitiesPrevious[particleIndex + 1];
                const dzPrevious = particleVelocitiesPrevious[particleIndex + 2];

                const dx = lerp(dxPrevious, dxCurrent, interpolateAlpha);
                const dy = lerp(dyPrevious, dyCurrent, interpolateAlpha);
                const dz = lerp(dzPrevious, dzCurrent, interpolateAlpha);

                const nx = this.cameraDir.y * dz - this.cameraDir.z * dy;
                const ny = this.cameraDir.z * dx - this.cameraDir.x * dz;
                const nz = this.cameraDir.x * dy - this.cameraDir.y * dx;

                const normalLength = this.ribbonWidth / Math.max(Math.sqrt(nx * nx + ny * ny + nz * nz), 1e-6);
                const offsetX = nx * normalLength;
                const offsetY = ny * normalLength;
                const offsetZ = nz * normalLength;

                const vertexIndex = (i * this.trailAmount + this.currentStartIndex) * 6;

                this.vertices[vertexIndex] = x - offsetX;
                this.vertices[vertexIndex + 1] = y - offsetY;
                this.vertices[vertexIndex + 2] = z - offsetZ;

                this.vertices[vertexIndex + 3] = x + offsetX;
                this.vertices[vertexIndex + 4] = y + offsetY;
                this.vertices[vertexIndex + 5] = z + offsetZ;

                const vertexIndexNext = (i * this.trailAmount + ((this.currentStartIndex + 1) % this.trailAmount)) * 6;

                this.vertices[vertexIndexNext] = x;
                this.vertices[vertexIndexNext + 1] = y;
                this.vertices[vertexIndexNext + 2] = z;

                this.vertices[vertexIndexNext + 3] = x;
                this.vertices[vertexIndexNext + 4] = y;
                this.vertices[vertexIndexNext + 5] = z;

                const vertexIndexNextNext =
                    (i * this.trailAmount + ((this.currentStartIndex + 2) % this.trailAmount)) * 6;

                const xLast = (this.vertices[vertexIndexNextNext] + this.vertices[vertexIndexNextNext + 3]) / 2.0;
                const yLast = (this.vertices[vertexIndexNextNext + 1] + this.vertices[vertexIndexNextNext + 4]) / 2.0;
                const zLast = (this.vertices[vertexIndexNextNext + 2] + this.vertices[vertexIndexNextNext + 5]) / 2.0;

                this.vertices[vertexIndexNextNext] = xLast;
                this.vertices[vertexIndexNextNext + 1] = yLast;
                this.vertices[vertexIndexNextNext + 2] = zLast;

                this.vertices[vertexIndexNextNext + 3] = xLast;
                this.vertices[vertexIndexNextNext + 4] = yLast;
                this.vertices[vertexIndexNextNext + 5] = zLast;
            }
        }

        updateColors(
            simulationStateCurrent: SimulationState,
            simulationStatePrevious: SimulationState,
            interpolateAlpha: number
        ) {
            const particleVelocitiesCurrent = simulationStateCurrent.particleVelocities;
            const particleVelocitiesPrevious = simulationStatePrevious.particleVelocities;

            const hueRotationCurrent = simulationStateCurrent.hueRotation;
            const hueRotationPrevious = simulationStatePrevious.hueRotation;
            const hueRotation = lerp(hueRotationPrevious, hueRotationCurrent, interpolateAlpha);

            const hueRangeCurrent = simulationStateCurrent.hueRange;
            const hueRangePrevious = simulationStatePrevious.hueRange;
            const hueRange = lerp(hueRangePrevious, hueRangeCurrent, interpolateAlpha);

            const huePositionCurrent = simulationStateCurrent.huePosition;
            const huePositionPrevious = simulationStatePrevious.huePosition;
            const huePosition = lerp(huePositionPrevious, huePositionCurrent, interpolateAlpha);

            const saturationCurrent = simulationStateCurrent.saturation;
            const saturationPrevious = simulationStatePrevious.saturation;
            const saturation = lerp(saturationPrevious, saturationCurrent, interpolateAlpha);

            const lightCurrent = simulationStateCurrent.light;
            const lightPrevious = simulationStatePrevious.light;
            const light = lerp(lightPrevious, lightCurrent, interpolateAlpha);

            const colorFrameRotationCurrent = simulationStateCurrent.colorFrameRotation;
            const colorFrameRotationPrevious = simulationStatePrevious.colorFrameRotation;
            this.qSlerped.w = colorFrameRotationPrevious.w;
            this.qSlerped.x = colorFrameRotationPrevious.x;
            this.qSlerped.y = colorFrameRotationPrevious.y;
            this.qSlerped.z = colorFrameRotationPrevious.z;
            const colorFrameRotation = this.qSlerped.slerp(colorFrameRotationCurrent, interpolateAlpha);

            for (let i = 0; i < this.particleAmount; i++) {
                const particleIndex = i * 3;

                const dxCurrent = particleVelocitiesCurrent[particleIndex];
                const dyCurrent = particleVelocitiesCurrent[particleIndex + 1];
                const dzCurrent = particleVelocitiesCurrent[particleIndex + 2];

                const dxPrevious = particleVelocitiesPrevious[particleIndex];
                const dyPrevious = particleVelocitiesPrevious[particleIndex + 1];
                const dzPrevious = particleVelocitiesPrevious[particleIndex + 2];

                const dx = lerp(dxPrevious, dxCurrent, interpolateAlpha);
                const dy = lerp(dyPrevious, dyCurrent, interpolateAlpha);
                const dz = lerp(dzPrevious, dzCurrent, interpolateAlpha);

                const velocityLengthSquared = dx * dx + dy * dy + dz * dz;

                const angle = Math.atan2(dy, dx) * RAD2DEG;
                const rotatedAngle = mod(angle + hueRotation + 180, 360);
                const halfAngle = 360 - 2 * Math.abs(rotatedAngle - 180);
                const hue = mod(
                    (halfAngle / 360) * hueRange +
                        huePosition -
                        hueRange / 2 +
                        velocityLengthSquared * this.velocityHueFactor,
                    360
                );

                this.colorHSL.setHSL(hue / 360.0, saturation / 100.0, light / 100.0);

                this.colorRGB.x = this.colorHSL.r;
                this.colorRGB.y = this.colorHSL.g;
                this.colorRGB.z = this.colorHSL.b;

                this.colorRGB.applyQuaternion(colorFrameRotation);
                this.colorRGB.clampScalar(0.0, 1.0);

                const indexColor = (i * this.trailAmount + this.currentStartIndex) * 8;

                this.colors[indexColor] = this.colorRGB.x;
                this.colors[indexColor + 1] = this.colorRGB.y;
                this.colors[indexColor + 2] = this.colorRGB.z;

                this.colors[indexColor + 4] = this.colorRGB.x;
                this.colors[indexColor + 5] = this.colorRGB.y;
                this.colors[indexColor + 6] = this.colorRGB.z;

                for (let j = 0; j < this.trailAmount; j++) {
                    const indexAlpha = (j - this.currentStartIndex + this.trailAmount) % this.trailAmount;
                    const a = this.alphaRamp[indexAlpha];

                    const indexColor = (i * this.trailAmount + j) * 8;
                    this.colors[indexColor + 3] = a;
                    this.colors[indexColor + 7] = a;
                }
            }
        }

        update(
            simulationStateCurrent: SimulationState,
            simulationStatePrevious: SimulationState,
            interpolateAlpha: number,
            backgroundColor: string
        ) {
            this.scene.background = this.backgroundColor.setStyle(backgroundColor);

            const scale = this.aspectRatio + 0.4;
            this.mesh.scale.set(scale, scale, scale);
            this.mesh.position.set(0.0, -25.0 * scale, 0.0);
            this.mesh.rotation.x = -Math.PI / 2.0;
            this.mesh.rotation.z = -Math.PI / 4.0;

            this.mesh.updateMatrixWorld(true);
            this.meshNormalMatrix.getNormalMatrix(this.mesh.matrixWorld);
            this.meshNormalMatrixTransposed.copy(this.meshNormalMatrix).transpose();
            this.camera.getWorldDirection(this.cameraDir);
            this.cameraDir.applyMatrix3(this.meshNormalMatrixTransposed);

            this.updateVertices(simulationStateCurrent, simulationStatePrevious, interpolateAlpha);
            this.updateColors(simulationStateCurrent, simulationStatePrevious, interpolateAlpha);

            this.currentStartIndex = (this.currentStartIndex + 1) % this.trailAmount;

            this.positionAttribute.needsUpdate = true;
            this.colorAttribute.needsUpdate = true;

            this.controls.update();
            this.threeRenderer.render(this.scene, this.camera);
        }
    }

    let webglSupported = $state(true);

    let canvas: HTMLCanvasElement = $state()!;

    onMount(() => {
        let resizeNow = true;
        const resizeObserver = new ResizeObserver(() => {
            resizeNow = true;
        });

        resizeObserver.observe(canvas);
        const mainRoot: HTMLElement = document.getElementById("mainRoot")!;

        let backgroundColor: string;
        let darkMode: boolean;

        function updateBackground() {
            backgroundColor = window.getComputedStyle(mainRoot).backgroundColor;
            darkMode = document.documentElement.classList.contains("dark");
        }

        const PARTICLES = 100;
        const TRAIL = 300;
        const WIDTH = 0.1;

        let renderer: Renderer;

        try {
            renderer = new Renderer(PARTICLES, TRAIL, WIDTH);
        } catch {
            webglSupported = false;
            return;
        }

        const simulationState = new SimulationState(PARTICLES);
        const simulationStatePrevious = new SimulationState(PARTICLES);

        renderer.initializeVertices(simulationState);

        const MAX_DT = 0.05;
        let timestampPrevious: DOMHighResTimeStamp = performance.now();
        let timestepAccumulator: number = 0.0;
        const fixedPhysicsTimestep = 1e-2;

        let animationFrameId: number;

        function animate(timestamp: DOMHighResTimeStamp): void {
            updateBackground();

            const dt = Math.min((timestamp - timestampPrevious) / 1000.0, MAX_DT);
            timestampPrevious = timestamp;

            timestepAccumulator += dt;
            while (timestepAccumulator > fixedPhysicsTimestep) {
                simulationState.copyTo(simulationStatePrevious);
                simulationState.update(fixedPhysicsTimestep, darkMode);
                timestepAccumulator -= fixedPhysicsTimestep;
            }

            if (resizeNow) {
                renderer.resize(canvas.clientWidth, canvas.clientHeight);
                resizeNow = false;
            }

            const interpolateAlpha = timestepAccumulator / fixedPhysicsTimestep;
            renderer.update(simulationState, simulationStatePrevious, interpolateAlpha, backgroundColor);

            animationFrameId = requestAnimationFrame(animate);
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            renderer.controls.dispose();
            renderer.scene.remove(renderer.mesh);
            renderer.geometry.dispose();
            renderer.material.dispose();
            renderer.threeRenderer.dispose();
        };
    });
</script>

{#if webglSupported}
    <div class="relative flex-1">
        <canvas bind:this={canvas} class="absolute h-full w-full"> Dynamical system simulator </canvas>
    </div>
{:else}
    <div class="flex flex-1 items-center justify-center text-lg">WebGL is not supported in your browser.</div>
{/if}
