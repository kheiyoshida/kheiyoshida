#version 300 es

in vec2 aPos;
in vec2 aUV;
out vec2 vUV;

void main() {
    vUV = vec2(abs(aUV.x), aUV.y);
    gl_Position = vec4(aPos, 0.0, 1.0);
}
