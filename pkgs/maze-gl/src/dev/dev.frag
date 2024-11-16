#version 300 es
precision mediump float;

in vec3 vNormal;
in vec3 vColor;

out vec4 fragColor;

uniform vec3 diffuse;

void main() {
    vec3 color = mix(vNormal, diffuse, 0.5);
    fragColor = vec4(vColor, 1.0);
}
