#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec3 diffuse;

void main() {
    fragColor = vec4(diffuse, 1.0);
}
