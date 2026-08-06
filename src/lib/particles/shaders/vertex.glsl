in float particleIndex;
in float trailIndex;
in float side;

uniform vec3 cameraDirection;
uniform float ribbonWidth;

uniform sampler2D positionTexture;
uniform float particleAmount;
uniform float trailAmount;
uniform float currentStartIndex;

uniform float dt;

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
    vec3 positionPrevious = getTrailPosition(particleIndex, mod(trailIndex - 1.0 + trailAmount, trailAmount));
    vec3 velocity = dt * (position - positionPrevious);

    vec3 ribbonNormal = normalize(cross(cameraDirection, velocity));
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
