#version 300 es
precision mediump float;

in vec2 vUV;

layout (location=0) out vec4 fragColor;// To COLOR_ATTACHMENT0
layout (location=1) out vec4 fragNormal;// To COLOR_ATTACHMENT1

uniform sampler2D uColorTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uDepthTexture;

const float fogNear = 0.0;
const float minFogFar = 0.1;
const float fogFarRange = 2.5;
const float distanceDiff = 0.4;

layout (std140) uniform Color
{
    vec3 unlitColor;
};

//layout (std140) uniform Effect
//{
//    float fogLevel;
//};

const float fogLevel = 10.0;

const float near = 0.01;
const float far = 1.0;

float linearizeDepth(float depth)
{
    float z = depth * 2.0 - 1.0; // back to NDC
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
    vec3 farColor = vec3(0.0, 0.0, 0.0);
    vec3 closeColor = texture(uColorTexture, vUV).xyz;

    float d = texture(uDepthTexture, vUV).r;
    float distance = linearizeDepth(d);

    float fogFactor = 0.01 + clamp(1.0 - exp(distance * pow(3.0, fogLevel)), 0.0, 0.99);

    vec3 finalColor = mix(closeColor, farColor, distance);

    fragColor = vec4(finalColor, 1.0);

    fragNormal = vec4(1, 1, 1, 1);
}
