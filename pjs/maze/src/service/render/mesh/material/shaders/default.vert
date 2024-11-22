#version 300 es
precision mediump float;

out vec3 vNormal;
out vec3 fragPos;

layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec3 aNormal;

uniform mat4 model;

layout (std140) uniform Eye
{
    mat4 projection;
    mat4 view;
};

layout (std140) uniform DeformedBox
{
    vec3 FBL, FBR, FTL, FTR, BBL, BBR, BTL, BTR;
    vec3 normalFBL, normalFBR, normalFTL, normalFTR;
    vec3 normalBBL, normalBBR, normalBTL, normalBTR;
};

vec3 trilinearInterpolateNormal(vec3 point) {
    float x = point.x;
    float y = point.y;
    float z = point.z;

    // Step 1: Interpolate along the X-axis for each corner pair
    vec3 NFrontBottom = mix(normalFBL, normalFBR, x);// Front-bottom normals
    vec3 NBackBottom = mix(normalBBL, normalBBR, x);// Back-bottom normals
    vec3 NFrontTop = mix(normalFTL, normalFTR, x);// Front-top normals
    vec3 NBackTop = mix(normalBTL, normalBTR, x);// Back-top normals

    // Step 2: Interpolate along the Z-axis (depth) for bottom and top planes
    vec3 NBottom = mix(NBackBottom, NFrontBottom, z);
    vec3 NTop = mix(NBackTop, NFrontTop, z);

    // Step 3: Final interpolation along the Y-axis
    vec3 interpolatedNormal = mix(NBottom, NTop, y);

    return normalize(interpolatedNormal);
}

void main() {

    vec3 normalizedPosition = (aPosition + vec3(1.0)) * 0.5;

    vec3 interpolatedNormal = trilinearInterpolateNormal(normalizedPosition);
    vNormal = mix(aNormal, interpolatedNormal, 0.2); // adjust the mix ratio

    vec3 transformedPosition =
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (normalizedPosition.z) * FBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (normalizedPosition.z) * FBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (normalizedPosition.z) * FTL +
    normalizedPosition.x * normalizedPosition.y * (normalizedPosition.z) * FTR +
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * BBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * BBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (1.0-normalizedPosition.z) * BTL +
    normalizedPosition.x * normalizedPosition.y * (1.0 - normalizedPosition.z) * BTR;

    fragPos = vec3(model * vec4(transformedPosition, 1.0));
    gl_Position = projection * view * vec4(fragPos, 1.0);
}
