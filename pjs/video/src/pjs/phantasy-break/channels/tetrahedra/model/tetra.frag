#version 300 es
precision highp float;

layout (location=0) out vec4 fragColor; // To COLOR_ATTACHMENT0
layout (location=1) out vec4 fragNormal; // To COLOR_ATTACHMENT1

in vec3 vNormal;

void main() {
    vec3 norm = vNormal;
    vec3 warmColor = vec3(0.8);
    vec3 coldColor = vec3(0.4);

    vec3 lightDir = normalize(vec3(1, -1, -1));

    float NL = dot(norm, lightDir);
    float t = (NL + 1.0) * 0.5;

    vec3 finalColor = mix(warmColor, coldColor, t);

    fragColor = vec4(finalColor, 1);


    vec3 ndcNormal = norm * 0.5 + 0.5;
    fragNormal = vec4(ndcNormal, 1);

    fragColor = vec4(vNormal , 1.0);
}
