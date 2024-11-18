#version 300 es
precision mediump float;

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
};

out vec3 vNormal;
out vec3 vColor;

void main() {
    vNormal = aNormal;
    vColor = vec3(0.0, 1.0, 0);

    vec3 normalizedPosition = (aPosition + vec3(1.0)) * 0.5;

    vec3 transformedPosition =
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * FBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * FBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (1.0 - normalizedPosition.z) * FTL +
    normalizedPosition.x * normalizedPosition.y * (1.0 - normalizedPosition.z) * FTR +
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * normalizedPosition.z * BBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * normalizedPosition.z * BBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * normalizedPosition.z * BTL +
    normalizedPosition.x * normalizedPosition.y * normalizedPosition.z * BTR;

    gl_Position = projection * view * model * vec4(transformedPosition, 1);
}
