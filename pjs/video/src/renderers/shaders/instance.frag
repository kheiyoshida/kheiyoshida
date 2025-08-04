#version 300 es

precision mediump float;

in vec3 vColor;
out vec4 fragColor;

void main() {
//    fragColor = vec4(1.0, 0.0, 0.0, 1.0); // red
    fragColor = vec4(vColor.x, vColor.y * 1.0, vColor.z, 1.0); // red
}
