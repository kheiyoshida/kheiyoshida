#version 300 es

precision mediump float;

in vec4 vColour;
out vec4 fragColor;

// Convert RGB to grayscale
float luminance(vec3 rgb) {
    return dot(rgb, vec3(0.299, 0.587, 0.114));
}

void main() {
    fragColor = vec4(vColour.rgb * 1.5, luminance(vColour.rgb));
}
