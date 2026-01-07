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

uniform vec3 relativeColor;

void main()
{
    vec3 norm = normalize(vNormal);

    vec3 finalColor;
    if (unlitColor.x > 0.5 && unlitColor.y > 0.5 && unlitColor.z > 0.5) {
        finalColor = unlitColor - relativeColor;
    } else {
        finalColor = unlitColor + relativeColor;
    }

    fragColor = vec4(finalColor, 1.0);

    vec3 ndcNormal = norm * 0.5 + 0.5;
    fragNormal = vec4(ndcNormal, 1.0);
}
