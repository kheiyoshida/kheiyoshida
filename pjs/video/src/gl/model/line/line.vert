#version 300 es

in vec2 aPos;

// instance attributes
in vec2 aStart;
in vec2 aEnd;
in vec3 aColor;

out vec3 vColor;

void main() {
    vec2 pos = gl_VertexID % 2 == 0 ? aStart : aEnd;
    gl_Position = vec4(pos, 0, 1);
    vColor = aColor;
}
