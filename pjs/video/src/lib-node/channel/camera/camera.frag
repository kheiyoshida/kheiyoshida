#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uContrast;
uniform float uBrightness;

void main() {
    vec4 color = texture(uTexture, vUV);
    vec4 adjusted = (color - 0.5) * uContrast + 0.5 + uBrightness;
    fragColor = vec4(adjusted.xyz, 1.0);
}
