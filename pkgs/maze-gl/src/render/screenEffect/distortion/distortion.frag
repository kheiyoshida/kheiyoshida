#version 300 es
precision mediump float;

in vec2 vUV;

layout (location=0) out vec4 fragColor;// To COLOR_ATTACHMENT0
layout (location=1) out vec4 fragNormal;// To COLOR_ATTACHMENT1

layout (std140) uniform Effect
{
    float uTime;
    vec3 uResolution;
};

uniform sampler2D uColorTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uDepthTexture;

uniform float uRandomizationLevel;

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233)) + uTime) * 43758.5453123);
}

void main() {
    vec3 result = vec3(0.0);

    vec3 color = vec3(texture(uColorTexture, vUV));
    vec3 normal = vec3(texture(uNormalTexture, vUV));

    vec3 randomVector = vec3(
        random(vUV * (normal.gb + color.gb)),
        random(vUV * (normal.rb + color.rb)),
        random(vUV * (normal.rg + color.rg))
    );

    vec3 colorDelta = vec3(min(min(randomVector.r, randomVector.g), randomVector.b));
    colorDelta = (colorDelta - 0.5) * 2.0; // normalize to [-1, 1] range

    vec3 randomDelta = colorDelta * mix(0.01, 0.4, uRandomizationLevel);
    result = color + randomDelta;

    fragColor = vec4(result, 1.0);

    fragNormal = vec4(1, 1, 1, 1);
}
