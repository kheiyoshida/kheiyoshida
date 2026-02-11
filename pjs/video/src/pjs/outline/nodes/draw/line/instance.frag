#version 300 es

precision mediump float;

in vec4 vColour;
in vec2 vUV;

uniform vec3 uColour;

out vec4 fragColor;

uniform sampler2D uColourTexture; // texture from the original video node

// Convert RGB to grayscale
float luminance(vec3 rgb) {
    return dot(rgb, vec3(0.299, 0.587, 0.114));
}

void main() {
    vec4 original = texture(uColourTexture, vUV);
    float grey = luminance(original.rgb);

    fragColor = vec4(uColour, grey);
}
