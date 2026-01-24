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

// https://rendermeapangolin.wordpress.com/2015/05/07/gooch-shading/
void main()
{
    vec3 norm = normalize(vNormal);

    vec3 warmColor;
    if (unlitColor.x > 0.5 && unlitColor.y > 0.5 && unlitColor.z > 0.5) {
        warmColor = unlitColor - relativeColor;
    } else {
        warmColor = unlitColor + relativeColor;
    }
    vec3 coldColor = mix(warmColor, unlitColor, 0.33);

    // comptue gooch shading
    float a = 0.2;
    float b = 0.6;

    vec3 lightDir = normalize(vec3(1, -1, -1));

    float NL = dot(norm, lightDir);
    float t = (NL + 1.0) * 0.5;

    vec3 cool = coldColor + a * vec3(1.0);
    vec3 warm = warmColor + b * vec3(1.0);

    vec3 finalColor = mix(warmColor, coldColor, t);

    vec3 ndcNormal = norm * 0.5 + 0.5;

    fragColor = vec4(finalColor, 1.0);
    fragNormal = vec4(ndcNormal, 1.0);
}
