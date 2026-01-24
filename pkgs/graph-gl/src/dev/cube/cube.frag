#version 300 es

precision mediump float;

in vec3 vNormal;

layout(location=0) out vec4 colorOut;
layout(location=1) out vec4 normalOut;

void main() {
    colorOut = vec4((vNormal + 1.0) / 2.0, 1);
    normalOut = vec4(vNormal, 1.0);
}
