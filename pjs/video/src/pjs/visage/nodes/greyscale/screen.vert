#version 300 es

in vec2 aPos;
in vec2 aUV;

uniform int uReverseHorizontal;
uniform int uReverseVertical;

out vec2 vUV;

void main() {
    float x = uReverseHorizontal == 1 ? 1.0 - aUV.x : aUV.x;
    float y = uReverseVertical == 1 ? 1.0 - aUV.y : aUV.y;
    vUV = vec2(x, y);
    gl_Position = vec4(aPos, 0.0, 1.0);
}
