#version 300 es

in vec3 aPos;
uniform mat4 uModel;
uniform vec3 uOffsets[8];

void main() {
    vec3 localPos = aPos + uOffsets[gl_VertexID];
    gl_Position = uModel * vec4(localPos, 1);
}
