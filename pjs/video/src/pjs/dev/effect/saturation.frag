#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;

uniform vec3 uSaturation;
uniform float uLuminanceCap;
uniform float uLuminanceBase;
uniform int uEnableSaturation;
uniform int uMonotone;

void main() {
    vec4 col = texture(uTexture, vUV);

    if (uMonotone == 1) {
        float val = max(col.x, max(col.y, col.z));
        fragColor = vec4(
            max(uLuminanceBase, min(uLuminanceCap, val)),
            max(uLuminanceBase, min(uLuminanceCap, val)),
            max(uLuminanceBase, min(uLuminanceCap, val)),
            1.0
        );
    } else if (uEnableSaturation == 1) {
        fragColor = vec4(
            max(uLuminanceBase, min(uLuminanceCap, col.x * uSaturation.x)),
            max(uLuminanceBase, min(uLuminanceCap, col.y * uSaturation.y)),
            max(uLuminanceBase, min(uLuminanceCap, col.z * uSaturation.z)),
            1.0
        );
    } else {
        fragColor = vec4(
            max(uLuminanceBase, min(uLuminanceCap, col.x)),
            max(uLuminanceBase, min(uLuminanceCap, col.y)),
            max(uLuminanceBase, min(uLuminanceCap, col.z)),
            1.0
        );
    }
}
