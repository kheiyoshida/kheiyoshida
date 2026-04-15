#version 300 es
precision highp float;

in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uResolution;

void main() {
    float dx = 1.0 / uResolution.x;
    float dy = 1.0 / uResolution.y;

    float center = texture(uTexture, vUV).r;
    float right = texture(uTexture, vUV + vec2(dx, 0.0)).r;
    float left = texture(uTexture, vUV + vec2(-dx, 0.0)).r;
    float up = texture(uTexture, vUV + vec2(0.0, dy)).r;
    float down = texture(uTexture, vUV + vec2(0.0, -dy)).r;

    const float threshold = 0.01;
    bool isDepthBorder = (
        abs(center - right) > threshold ||
        abs(center - left) > threshold ||
        abs(center - up) > threshold ||
        abs(center - down) > threshold
    );

    if (isDepthBorder) {
        fragColor = vec4(1, 1, 1, 1);
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }

//    fragColor = texture(uTexture, vUV);
}
