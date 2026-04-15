#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform sampler2D uHistoryTexture;
uniform float uAmount;

void main() {
    vec4 original = texture(uTexture, vUV);
    vec4 history = texture(uHistoryTexture, vUV);
    fragColor = mix(original, history, uAmount);
}
