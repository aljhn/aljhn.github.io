import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { SimulationState } from "./simulation";
import { lerp, mod, RAD2DEG } from "./utils";

export class Renderer {
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

    constructor(canvas: HTMLCanvasElement, particleAmount: number, trailAmount: number, ribbonWidth: number) {
        this.particleAmount = particleAmount;
        this.trailAmount = trailAmount;
        this.ribbonWidth = ribbonWidth;

        const FOV = 60;
        this.camera = new THREE.PerspectiveCamera(FOV, canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
        this.camera.position.set(0, 0, 50);
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

        this.positionAttribute = this.mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
        this.positionAttribute.setUsage(THREE.DynamicDrawUsage);

        this.colorAttribute = this.mesh.geometry.getAttribute("color") as THREE.BufferAttribute;
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

        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();

        this.mesh.position.set(0.0, -25.0, 0.0);
        this.mesh.rotation.x = -Math.PI / 2.0;
        this.mesh.rotation.z = -Math.PI / 4.0;

        this.mesh.updateMatrixWorld(true);
        this.meshNormalMatrix.getNormalMatrix(this.mesh.matrixWorld);
        this.meshNormalMatrixTransposed.copy(this.meshNormalMatrix).transpose();
    }

    initializeVertices(simulationState: SimulationState): void {
        const particlePositions = simulationState.particlePositions;

        for (let i = 0; i < this.particleAmount; i++) {
            for (let j = 0; j < this.trailAmount; j++) {
                const vertexIndex = (i * this.trailAmount + j) * 6;
                const positionIndex = i * 3;

                this.vertices[vertexIndex] = particlePositions[positionIndex];
                this.vertices[vertexIndex + 1] = particlePositions[positionIndex + 1];
                this.vertices[vertexIndex + 2] = particlePositions[positionIndex + 2];

                this.vertices[vertexIndex + 3] = particlePositions[positionIndex];
                this.vertices[vertexIndex + 4] = particlePositions[positionIndex + 1];
                this.vertices[vertexIndex + 5] = particlePositions[positionIndex + 2];
            }
        }
    }

    resize(width: number, height: number): void {
        this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.threeRenderer.setSize(width, height, false);

        this.aspectRatio = width / height;

        let cameraPos = 150 - width / 5;
        if (cameraPos > 100) {
            cameraPos = 100;
        } else if (cameraPos < 50) {
            cameraPos = 50;
        }
        this.camera.position.set(0, 0, cameraPos);

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

            const vertexIndexNextNext = (i * this.trailAmount + ((this.currentStartIndex + 2) % this.trailAmount)) * 6;

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
