import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { SimulationState } from "./simulation";
import { lerp } from "./utils";

export class Renderer {
    particleAmount: number;
    trailAmount: number;
    ribbonWidth: number;

    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    threeRenderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    positionTextureData: Float32Array;
    velocityTextureData: Float32Array;

    positionTexture: THREE.DataTexture;
    velocityTexture: THREE.DataTexture;

    indexes: Uint32Array;
    particleIndexes: Float32Array;
    trailIndexes: Float32Array;
    sides: Float32Array;

    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;

    aspectRatio: number;

    cameraDir: THREE.Vector3;
    meshNormalMatrix: THREE.Matrix3;
    meshNormalMatrixTransposed: THREE.Matrix3;

    backgroundColor: THREE.Color;
    darkMode: boolean;

    currentStartIndex: number;

    velocityHueFactor: number;

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
        if (this.threeRenderer.capabilities.isWebGL2 == false) {
            throw new Error("WebGL2 not supported");
        }

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;

        this.positionTextureData = new Float32Array(particleAmount * trailAmount * 4);
        this.velocityTextureData = new Float32Array(particleAmount * trailAmount * 4);

        this.positionTexture = new THREE.DataTexture(
            this.positionTextureData,
            particleAmount,
            trailAmount,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        this.positionTexture.magFilter = THREE.NearestFilter;
        this.positionTexture.minFilter = THREE.NearestFilter;
        this.positionTexture.wrapS = THREE.RepeatWrapping;
        this.positionTexture.wrapT = THREE.ClampToEdgeWrapping;
        this.positionTexture.internalFormat = "RGBA32F";

        this.velocityTexture = new THREE.DataTexture(
            this.velocityTextureData,
            particleAmount,
            trailAmount,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        this.velocityTexture.magFilter = THREE.NearestFilter;
        this.velocityTexture.minFilter = THREE.NearestFilter;
        this.velocityTexture.wrapS = THREE.RepeatWrapping;
        this.velocityTexture.wrapT = THREE.ClampToEdgeWrapping;
        this.velocityTexture.internalFormat = "RGBA32F";

        this.indexes = new Uint32Array(2 * this.particleAmount * this.trailAmount * 3);
        const maxIndex = this.trailAmount * 2;
        for (let i = 0; i < this.particleAmount; i++) {
            for (let j = 0; j < this.trailAmount; j++) {
                const insertIndex = (i * this.trailAmount + j) * 6;
                const index = j * 2;
                const indexOffset = i * maxIndex;

                this.indexes[insertIndex + 0] = ((index + 0) % maxIndex) + indexOffset;
                this.indexes[insertIndex + 1] = ((index + 1) % maxIndex) + indexOffset;
                this.indexes[insertIndex + 2] = ((index + 2) % maxIndex) + indexOffset;

                this.indexes[insertIndex + 3] = ((index + 1) % maxIndex) + indexOffset;
                this.indexes[insertIndex + 4] = ((index + 3) % maxIndex) + indexOffset;
                this.indexes[insertIndex + 5] = ((index + 2) % maxIndex) + indexOffset;
            }
        }

        this.particleIndexes = new Float32Array(2 * particleAmount * trailAmount);
        this.trailIndexes = new Float32Array(2 * particleAmount * trailAmount);

        for (let i = 0; i < particleAmount; i++) {
            for (let j = 0; j < trailAmount; j++) {
                const index = (i * trailAmount + j) * 2;

                this.particleIndexes[index] = i;
                this.particleIndexes[index + 1] = i;

                this.trailIndexes[index] = j;
                this.trailIndexes[index + 1] = j;
            }
        }

        this.sides = new Float32Array(2 * particleAmount * trailAmount);
        for (let i = 0; i < this.sides.length; i++) {
            this.sides[i] = (i % 2) * 2 - 1;
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("particleIndex", new THREE.BufferAttribute(this.particleIndexes, 1));
        this.geometry.setAttribute("trailIndex", new THREE.BufferAttribute(this.trailIndexes, 1));
        this.geometry.setAttribute("side", new THREE.BufferAttribute(this.sides, 1));
        this.geometry.setIndex(new THREE.BufferAttribute(this.indexes, 1));

        this.cameraDir = new THREE.Vector3();
        this.meshNormalMatrix = new THREE.Matrix3();
        this.meshNormalMatrixTransposed = new THREE.Matrix3();

        this.currentStartIndex = 0;

        this.velocityHueFactor = 0.0001;

        const vertexShader = `
            in float particleIndex;
            in float trailIndex;
            in float side;

            uniform vec3 cameraDirection;
            uniform float ribbonWidth;

            uniform sampler2D positionTexture;
            uniform sampler2D velocityTexture;
            uniform float particleAmount;
            uniform float trailAmount;
            uniform float currentStartIndex;

            uniform float hueRotation;
            uniform float hueRange;
            uniform float huePosition;
            uniform float saturation;
            uniform float light;
            uniform float velocityHueFactor;
            uniform vec4 colorFrameRotation;

            out vec4 vColor;

            vec3 getTrailPosition(float particle, float trail) {
                vec2 uv;
                uv.x = (particle + 0.5) / particleAmount;
                uv.y = (trail + 0.5) / trailAmount;

                return texture(positionTexture, uv).xyz;
            }

            vec3 getTrailVelocity(float particle, float trail) {
                vec2 uv;
                uv.x = (particle + 0.5) / particleAmount;
                uv.y = (trail + 0.5) / trailAmount;

                return texture(velocityTexture, uv).xyz;
            }

            vec3 hsl2rgb(vec3 hsl) {
                vec3 rgb = clamp(
                    abs(mod(hsl.x * 6.0 + vec3(0, 4, 2), 6.0) - 3.0) - 1.0,
                    0.0,
                    1.0
                );

                return hsl.z + hsl.y *
                    (rgb - 0.5) *
                    (1.0 - abs(2.0 * hsl.z - 1.0));
            }

            vec3 rotateVectorByQuaternion(vec3 v, vec4 q) {
                vec3 t = 2.0 * cross(q.xyz, v);
                return v + q.w * t + cross(q.xyz, t);
            }

            void main() {
                vec3 position = getTrailPosition(particleIndex, trailIndex);
                vec3 velocity = getTrailVelocity(particleIndex, trailIndex);

                vec3 tangent = normalize(velocity + vec3(1e-6));
                vec3 ribbonNormal = normalize(cross(cameraDirection, tangent));
                vec3 finalPosition = position + side * ribbonWidth * ribbonNormal;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);

                float velocityLengthSquared = dot(velocity, velocity);
                float angle = degrees(atan(velocity.y, velocity.x));
                float rotatedAngle = mod(angle + hueRotation + 180.0, 360.0);
                float halfAngle = 360.0 - 2.0 * abs(rotatedAngle - 180.0);
                float hue = mod(
                    (halfAngle / 360.0) * hueRange +
                        huePosition -
                        hueRange / 2.0 +
                        velocityLengthSquared * velocityHueFactor,
                    360.0
                );

                vec3 rgb = hsl2rgb(vec3(hue / 360.0, saturation / 100.0, light / 100.0));
                rgb = rotateVectorByQuaternion(rgb, colorFrameRotation);
                rgb = clamp(rgb, 0.0, 1.0);

                float trailAge = mod(trailIndex - currentStartIndex + trailAmount, trailAmount);
                float alpha = pow(trailAge / (trailAmount - 1.0), 3.0);

                vColor = vec4(rgb.x, rgb.y, rgb.z, alpha);
            }
        `;

        const fragmentShader = `
            in vec4 vColor;

            out vec4 outColor;

            void main() {
                outColor = vColor;
            }
        `;

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            side: THREE.FrontSide,
            depthWrite: false,
            glslVersion: THREE.GLSL3,
            uniforms: {
                cameraDirection: {
                    value: this.cameraDir
                },
                ribbonWidth: {
                    value: this.ribbonWidth
                },
                positionTexture: {
                    value: this.positionTexture
                },
                velocityTexture: {
                    value: this.velocityTexture
                },
                particleAmount: {
                    value: this.particleAmount
                },
                trailAmount: {
                    value: this.trailAmount
                },
                currentStartIndex: {
                    value: this.currentStartIndex
                },
                hueRotation: {
                    value: 0
                },
                hueRange: {
                    value: 360
                },
                huePosition: {
                    value: 0
                },
                saturation: {
                    value: 100
                },
                light: {
                    value: 50
                },
                velocityHueFactor: {
                    value: this.velocityHueFactor
                },
                colorFrameRotation: {
                    value: new THREE.Vector4()
                }
            }
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.scene.add(this.mesh);

        this.threeRenderer.render(this.scene, this.camera);

        this.aspectRatio = 1.0;

        this.backgroundColor = new THREE.Color();
        this.darkMode = true;

        this.qSlerped = new THREE.Quaternion();

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
                const vertexIndex = (i + this.particleAmount * j) * 4;
                const positionIndex = i * 3;

                this.positionTextureData[vertexIndex + 0] = particlePositions[positionIndex];
                this.positionTextureData[vertexIndex + 1] = particlePositions[positionIndex + 1];
                this.positionTextureData[vertexIndex + 2] = particlePositions[positionIndex + 2];
                this.positionTextureData[vertexIndex + 3] = 1.0;

                this.velocityTextureData[vertexIndex + 0] = 0.0;
                this.velocityTextureData[vertexIndex + 1] = 0.0;
                this.velocityTextureData[vertexIndex + 2] = 0.0;
                this.velocityTextureData[vertexIndex + 3] = 1.0;
            }
        }

        this.positionTexture.clearUpdateRanges();
        this.velocityTexture.clearUpdateRanges();

        this.positionTexture.needsUpdate = true;
        this.velocityTexture.needsUpdate = true;
    }

    resize(width: number, height: number): void {
        this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.threeRenderer.setSize(width, height, false);

        this.aspectRatio = width / height;

        let cameraPos = 200 - width / 4;
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

            const xCurrent = particlePositionsCurrent[particleIndex + 0];
            const yCurrent = particlePositionsCurrent[particleIndex + 1];
            const zCurrent = particlePositionsCurrent[particleIndex + 2];

            const xPrevious = particlePositionsPrevious[particleIndex + 0];
            const yPrevious = particlePositionsPrevious[particleIndex + 1];
            const zPrevious = particlePositionsPrevious[particleIndex + 2];

            const x = lerp(xPrevious, xCurrent, interpolateAlpha);
            const y = lerp(yPrevious, yCurrent, interpolateAlpha);
            const z = lerp(zPrevious, zCurrent, interpolateAlpha);

            const dxCurrent = particleVelocitiesCurrent[particleIndex + 0];
            const dyCurrent = particleVelocitiesCurrent[particleIndex + 1];
            const dzCurrent = particleVelocitiesCurrent[particleIndex + 2];

            const dxPrevious = particleVelocitiesPrevious[particleIndex + 0];
            const dyPrevious = particleVelocitiesPrevious[particleIndex + 1];
            const dzPrevious = particleVelocitiesPrevious[particleIndex + 2];

            const dx = lerp(dxPrevious, dxCurrent, interpolateAlpha);
            const dy = lerp(dyPrevious, dyCurrent, interpolateAlpha);
            const dz = lerp(dzPrevious, dzCurrent, interpolateAlpha);

            const index = (i + this.currentStartIndex * this.particleAmount) * 4;

            this.positionTextureData[index + 0] = x;
            this.positionTextureData[index + 1] = y;
            this.positionTextureData[index + 2] = z;
            this.positionTextureData[index + 3] = 1.0;

            this.velocityTextureData[index + 0] = dx;
            this.velocityTextureData[index + 1] = dy;
            this.velocityTextureData[index + 2] = dz;
            this.velocityTextureData[index + 3] = 1.0;
        }

        const offset = this.currentStartIndex * this.particleAmount * 4;
        const count = this.particleAmount * 4;

        this.positionTexture.addUpdateRange(offset, count);
        this.velocityTexture.addUpdateRange(offset, count);

        this.positionTexture.needsUpdate = true;
        this.velocityTexture.needsUpdate = true;
    }

    updateColors(
        simulationStateCurrent: SimulationState,
        simulationStatePrevious: SimulationState,
        interpolateAlpha: number
    ) {
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

        const uniforms = this.material.uniforms;

        uniforms.currentStartIndex.value = this.currentStartIndex;

        uniforms.hueRotation.value = hueRotation;
        uniforms.hueRange.value = hueRange;
        uniforms.huePosition.value = huePosition;
        uniforms.saturation.value = saturation;
        if (this.darkMode) {
            uniforms.light.value = light;
        } else {
            uniforms.light.value = 100.0 - light;
        }

        uniforms.colorFrameRotation.value.w = colorFrameRotation.w;
        uniforms.colorFrameRotation.value.x = colorFrameRotation.x;
        uniforms.colorFrameRotation.value.y = colorFrameRotation.y;
        uniforms.colorFrameRotation.value.z = colorFrameRotation.z;
    }

    update(
        simulationStateCurrent: SimulationState,
        simulationStatePrevious: SimulationState,
        interpolateAlpha: number,
        backgroundColor: string
    ) {
        this.scene.background = this.backgroundColor.setStyle(backgroundColor);

        const backgroundColorGrayScale =
            0.2126 * this.backgroundColor.r + 0.7152 * this.backgroundColor.g + 0.0722 * this.backgroundColor.b;
        this.darkMode = backgroundColorGrayScale < 0.5;

        this.camera.getWorldDirection(this.cameraDir);
        this.cameraDir.applyMatrix3(this.meshNormalMatrixTransposed);

        this.material.uniforms.cameraDirection.value.copy(this.cameraDir);
        this.material.uniforms.ribbonWidth.value = this.ribbonWidth;

        this.updateVertices(simulationStateCurrent, simulationStatePrevious, interpolateAlpha);
        this.updateColors(simulationStateCurrent, simulationStatePrevious, interpolateAlpha);

        this.currentStartIndex = (this.currentStartIndex + 1) % this.trailAmount;

        this.controls.update();
        this.threeRenderer.render(this.scene, this.camera);
    }
}
