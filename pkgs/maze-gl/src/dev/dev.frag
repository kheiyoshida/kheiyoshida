#version 300 es
precision mediump float;

in vec3 vNormal;

out vec4 fragColor;

uniform vec3 diffuse;

void main() {
    vec3 color = mix(vNormal, diffuse, 0.5);
    fragColor = vec4(color, 1.0);
}
