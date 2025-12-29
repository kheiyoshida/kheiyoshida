#version 300 es
precision highp float;

layout (location=0) out vec4 fragColor; // To COLOR_ATTACHMENT0
layout (location=1) out vec4 fragNormal; // To COLOR_ATTACHMENT1

in vec3 vNormal;
in vec3 fragPos;

layout (std140) uniform Color
{
    vec3 unlitColor;
};

const float distanceDiff = 0.4;

void main()
{
    vec3 norm = normalize(vNormal);

    vec3 finalColor;
    if (unlitColor.x > 0.5 && unlitColor.y > 0.5 && unlitColor.z > 0.5) {
        finalColor = unlitColor - distanceDiff;
    } else {
        finalColor = unlitColor + distanceDiff;
    }

    fragColor = vec4(finalColor, 1.0);

    fragNormal = vec4(norm * 0.5 + 0.5, 1.0);
}
