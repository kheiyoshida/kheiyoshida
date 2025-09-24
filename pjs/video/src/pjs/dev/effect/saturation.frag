#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;

void main() {
    vec4 col = texture(uTexture, vUV);
//    fragColor = vec4(col.x * 0.5, col.y * 1.5, col.z * 0.5, 1.0);
    fragColor = vec4(vec3(col.x), 1.0);
}
