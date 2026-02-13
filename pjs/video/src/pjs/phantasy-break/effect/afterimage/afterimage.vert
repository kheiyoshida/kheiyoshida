#version 300 es

in vec2 aPos;
in vec2 aUV;

uniform int uReverseHorizontal;

out vec2 vUV;

void main() {
    if (uReverseHorizontal == 1) {
        vUV = vec2(1.0 - aUV.x, aUV.y);
    } else {
        vUV = aUV;
    }
    gl_Position = vec4(aPos, 0.0, 1.0);
}
