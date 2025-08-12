#version 300 es

in vec2 aPos;
out vec2 vPos;
uniform float uAngle;

void main() {
    float c = cos(uAngle), s = sin(uAngle);
    mat2 rot = mat2(c, -s, s, c);
    gl_Position = vec4(rot * aPos, 0, 1);
    vPos = aPos;
}
