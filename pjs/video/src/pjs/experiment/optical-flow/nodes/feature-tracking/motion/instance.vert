#version 300 es

in vec2 aPos;

in vec2 aStart;
in vec2 aEnd;

void main() {
    vec2 pos = mix(aStart, aEnd, aPos.x);
    gl_Position = vec4(pos * 2.0 - 1.0, 0, 1);
}
