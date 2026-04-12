#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aNormal;
in vec3 aCenter;

out vec3 vNormal;
out vec3 vPos;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {

    vNormal = aNormal;
    vec3 pos = aCenter + (aPosition - aCenter) * 1.0;
    vec4 modelPos = uModel * vec4(pos, 1.0);
    vPos = modelPos.xyz;

    gl_Position   = uProjection * uView * modelPos;
}
