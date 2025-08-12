#version 300 es

precision mediump float;

in vec3 vColor;
out vec4 fragColor;

void main() {
//    fragColor = vec4(1.0, 0.0, 0.0, 1.0); // red
    fragColor = vec4(vColor.x + 0.1, vColor.y + 0.1, vColor.z + 0.1, 1); // red
}
