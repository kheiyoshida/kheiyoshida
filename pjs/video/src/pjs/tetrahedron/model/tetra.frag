#version 300 es
precision highp float;

in vec3 vNormal;
out vec4 fragColor;

void main() {
//    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
    fragColor = vec4((vNormal + 1.0) / 2.0 , 1.0);
}
