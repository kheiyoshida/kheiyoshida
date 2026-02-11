#version 300 es

precision mediump float;

in vec4 vColour;
in vec2 vUV;

out vec4 fragColor;

// Convert RGB to grayscale
float luminance(vec3 rgb) {
    return dot(rgb, vec3(0.299, 0.587, 0.114));
}

void main() {
    fragColor = vec4(0, 0, 0, 1);
}
