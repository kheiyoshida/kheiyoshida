#version 300 es

in float aSize;
in vec2 aPos;
in vec3 aColor;
in vec2 aOffset;

out vec3 vColor;

void main() {
    vec2 scaled = aPos * aSize;
    vec2 world = aOffset + scaled;
    gl_Position = vec4(world * 2.0 - 1.0, 0, 1);
    vColor = aColor;
}
