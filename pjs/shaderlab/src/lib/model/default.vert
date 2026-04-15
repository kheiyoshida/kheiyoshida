#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aNormal;

out vec3 vNormal;
out vec3 vPos;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
    vNormal = aNormal;
    vec4 modelPos = uModel * vec4(aPosition, 1.0);
    vPos = modelPos.xyz;
    gl_Position   = uProjection * uView * modelPos;
}
