#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform vec2 uTexelSize;
uniform sampler2D uTexture;

// Convert RGB to grayscale
float luminance(vec3 rgb) {
    return dot(rgb, vec3(0.299, 0.587, 0.114));
}

void main() {
    float center = luminance(texture(uTexture, vUV).rgb);

    // neighbour offsets
    vec2 dx = vec2(uTexelSize.x, 0.0);
    vec2 dy = vec2(0.0, uTexelSize.y);

    // sample neighbours
    float left = luminance(texture(uTexture, vUV - dx).rgb);
    float right = luminance(texture(uTexture, vUV + dx).rgb);
    float down = luminance(texture(uTexture, vUV - dy).rgb);
    float up = luminance(texture(uTexture, vUV + dy).rgb);

    float diffX = right - left;
    float diffY = up - down;

    float score = length(vec2(diffX, diffY));

    fragColor = vec4(
        score,
        diffX * 0.5 + 0.5,
        diffY * 0.5 + 0.5,
        center
    );
}
