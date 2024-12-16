#version 300 es

precision highp float;

out vec4 fragColor;

in vec2 TexCoords;

uniform sampler2D ColorTexture;
uniform sampler2D NormalTexture;
uniform sampler2D DepthTexture;

// common uniforms
uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uBaseColor;
uniform float uFadeoutPercentage;

// shader-specific
uniform float uBlurLevel;

vec3 applyFade(vec3 processedColor) {
    if (uFadeoutPercentage == 0.0) return processedColor;
    return mix(processedColor, uBaseColor, uFadeoutPercentage);
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453123);
}

const float maxBlurIntensity = 20.0;

vec3 getBlurredColor() {
    float intensity = floor(uBlurLevel * maxBlurIntensity);
    float offsetX = intensity / uResolution.x;
    float offsetY = intensity / uResolution.y;
    vec2 offsets[9] = vec2[](
    vec2(-offsetX, offsetY), // top-left
    vec2( 0.0f, offsetX), // top-center
    vec2( offsetX, offsetY), // top-right
    vec2(-offsetX, 0.0f), // center-left
    vec2( 0.0f, 0.0f), // center-center
    vec2( offsetX, 0.0f), // center-right
    vec2(-offsetX, -offsetY), // bottom-left
    vec2( 0.0f, -offsetY), // bottom-center
    vec2( offsetX, -offsetY) // bottom-right
    );

    float kernel[9] = float[](
    1.0 / 16.0, 2.0 / 16.0, 1.0 / 16.0,
    2.0 / 16.0, 4.0 / 16.0, 2.0 / 16.0,
    1.0 / 16.0, 2.0 / 16.0, 1.0 / 16.0
    );

    vec3 sampleTex[9];
    for (int i = 0; i < 9; i++)
    {
        sampleTex[i] = vec3(texture(ColorTexture, TexCoords.st + offsets[i]));
    }

    vec3 color = vec3(0.0);
    for (int i = 0; i < 9; i++) {
        color += sampleTex[i] * kernel[i];
    }

    return color;
}

void main() {
    vec3 blurredColor = getBlurredColor();

    fragColor = vec4(applyFade(blurredColor), 1.0);
}
