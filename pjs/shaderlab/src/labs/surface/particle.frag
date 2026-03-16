#version 300 es
precision highp float;

in vec3 vPos;
in vec3 vNormal;

layout(location=0) out vec4 fragColor;
layout (location=1) out vec4 fragNormal;

uniform sampler2D uDepthTexture;
uniform float uTime;

void main() {
    fragColor = vec4(1.0, 1.0, 1.0, 0.1);
    fragNormal = vec4(1.0);
}
