#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
    gl_Position   = uProjection * uView * uModel * vec4(aPosition, 1.0);
}
