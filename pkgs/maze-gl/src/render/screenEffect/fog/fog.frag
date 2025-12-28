#version 300 es
precision mediump float;

in vec2 vUV;

layout (location=0) out vec4 fragColor; // To COLOR_ATTACHMENT0

uniform sampler2D uColorTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uDepthTexture;

const float fogNear = 0.0;
const float minFogFar = 0.1;
const float fogFarRange = 2.5;
const float distanceDiff = 0.4;

layout (std140) uniform Color
{
    vec3 baseColor;
};

const float near = 0.01;
const float far = 1.0;

float linearizeDepth(float depth)
{
    float z = depth * 2.0 - 1.0; // back to NDC
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
    vec3 farColor = baseColor;
    vec3 closeColor = texture(uColorTexture, vUV).xyz;

    float depth = texture(uDepthTexture, vUV).r;
    float distance = linearizeDepth(depth);

    vec3 finalColor = mix(closeColor, farColor, distance);
    fragColor = vec4(finalColor, 1.0);
}
