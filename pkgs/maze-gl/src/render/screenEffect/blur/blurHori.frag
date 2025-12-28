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

void main() {
    vec2 texelSize = vec2(1.0 / uResolution.x, 1.0 / uResolution.y);
//    vec2 texelSize = vec2(1.0 / 800.0, 1.0 / 400.0);

    vec3 result = vec3(0.0);

    // 9-tap Gaussian weights (sigma ≈ 2.0)
    float w0 = 0.227027;
    float w1 = 0.1945946;
    float w2 = 0.1216216;
    float w3 = 0.054054;
    float w4 = 0.016216;

    result += texture(uColorTexture, vUV).rgb * w0;

    result += texture(uColorTexture, vUV + vec2(texelSize.x * 1.0, 0.0)).rgb * w1;
    result += texture(uColorTexture, vUV - vec2(texelSize.x * 1.0, 0.0)).rgb * w1;

    result += texture(uColorTexture, vUV + vec2(texelSize.x * 2.0, 0.0)).rgb * w2;
    result += texture(uColorTexture, vUV - vec2(texelSize.x * 2.0, 0.0)).rgb * w2;

    result += texture(uColorTexture, vUV + vec2(texelSize.x * 3.0, 0.0)).rgb * w3;
    result += texture(uColorTexture, vUV - vec2(texelSize.x * 3.0, 0.0)).rgb * w3;

    result += texture(uColorTexture, vUV + vec2(texelSize.x * 4.0, 0.0)).rgb * w4;
    result += texture(uColorTexture, vUV - vec2(texelSize.x * 4.0, 0.0)).rgb * w4;

    fragColor = vec4(result, 1.0);

    fragNormal = vec4(1, 1, 1, 1);
}
