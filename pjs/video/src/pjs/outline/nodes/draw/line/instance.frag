#version 300 es

precision mediump float;

in vec4 vColour;

out vec4 fragColor;

uniform sampler2D uColourTexture; // texture from the original video node

void main() {
//    fragColor = vColour;
    fragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
