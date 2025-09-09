#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;

void main() {
    vec4 col = texture(uTexture, vUV);
    fragColor = vec4(col.x, col.y, col.x, 1.0);
}
