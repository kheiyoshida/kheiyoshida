#version 300 es

in vec2 aPos;
in vec3 aColor;
in vec2 aOffset;

uniform float uSize;

out vec3 vColor;

void main() {
    vec2 scaled = aPos * uSize;
    vec2 world = aOffset + scaled;
    gl_Position = vec4(world * 2.0 - 1.0, 0, 1);
    vColor = aColor;
}
