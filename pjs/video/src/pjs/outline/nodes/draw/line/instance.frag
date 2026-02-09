#version 300 es

precision mediump float;
out vec4 fragColor;

uniform sampler2D uColourTexture; // texture from the original video node

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
