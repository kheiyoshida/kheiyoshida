#version 300 es
in vec2 aPosition;   // quad corner
in vec2 aInstance;   // dot center

uniform float uRadius;

out vec2 vUV;

void main() {
    vec2 scaled = aPosition * uRadius;

    vec2 world = aInstance + scaled;
    gl_Position = vec4(world * 2.0 - 1.0, 0.0, 1.0);
    vUV = aPosition + 0.5;
}
