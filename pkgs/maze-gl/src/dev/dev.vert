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

    // Step 1: Interpolate along the X-axis for each pair of corner normals
    vec3 N00 = mix(normalFBL, normalFBR, x);// Between front-bottom-left and front-bottom-right
    vec3 N10 = mix(normalBBL, normalBBR, x);// Between back-bottom-left and back-bottom-right
    vec3 N01 = mix(normalFTL, normalFTR, x);// Between front-top-left and front-top-right
    vec3 N11 = mix(normalBTL, normalBTR, x);// Between back-top-left and back-top-right

    // Step 2: Interpolate along the Y-axis for the interpolated normals
    vec3 N0 = mix(N00, N10, y);
    vec3 N1 = mix(N01, N11, y);

    // Step 3: Final interpolation along the Z-axis
    vec3 interpolatedNormal = mix(N0, N1, z);

    return normalize(interpolatedNormal);
}

void main() {

    vec3 normalizedPosition = (aPosition + vec3(1.0)) * 0.5;

    vec3 interpolatedNormal = trilinearInterpolateNormal(normalizedPosition);
    vNormal = mix(aNormal, interpolatedNormal, 0.25); // adjust the mix ratio

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
