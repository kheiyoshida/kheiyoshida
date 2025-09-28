#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;

uniform vec3 uSaturation;
uniform vec3 uCap;

void main() {
    vec4 col = texture(uTexture, vUV);
    fragColor = vec4(
        min(uCap.x, col.x * uSaturation.x),
        min(uCap.y, col.y * uSaturation.y),
        min(uCap.z, col.z * uSaturation.z),
        1.0
    );
}
