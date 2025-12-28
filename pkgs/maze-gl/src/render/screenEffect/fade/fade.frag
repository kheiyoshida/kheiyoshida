#version 300 es
precision mediump float;

in vec2 vUV;

layout (location=0) out vec4 fragColor;// To COLOR_ATTACHMENT0

layout (std140) uniform Color
{
    vec3 uBaseColor;
};

uniform sampler2D uColorTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uDepthTexture;

uniform float uFadeoutPercentage;

void main() {
    vec3 color = vec3(texture(uColorTexture, vUV));

    vec3 result;
    if (uFadeoutPercentage == 0.0) {
        result = color;
    } else {
        result = mix(color, uBaseColor, uFadeoutPercentage);
    }
    fragColor = vec4(result, 1.0);
}
