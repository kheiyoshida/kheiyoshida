#version 300 es
precision mediump float;

layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec3 aNormal;

uniform mat4 model;

layout (std140) uniform Matrices
{
    mat4 projection;
    mat4 view;
};

layout (std140) uniform DeformedBox
{
    mat4 FBL;
    mat4 FBR;
};

out vec3 vNormal;

void main() {
    vNormal = aNormal;

    gl_Position = projection * view * model * vec4(aPosition, 1.0);
}
