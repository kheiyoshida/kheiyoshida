#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uTime;

float textureSourceNoise (in vec2 st, float tileSize) {
    vec2 tileSpanUV = vec2(tileSize / uResolution.x, tileSize / uResolution.y);

    vec2 tileIndex = floor(st / tileSpanUV);
    vec2 tileOriginUV = tileIndex * tileSpanUV;

    float a = texture(uTexture, tileOriginUV).r;
    float b = texture(uTexture, tileOriginUV + tileSpanUV * vec2(1.0, 0.0)).r;
    float c = texture(uTexture, tileOriginUV + tileSpanUV * vec2(0.0, 1.0)).r;
    float d = texture(uTexture, tileOriginUV + tileSpanUV * vec2(1.0, 1.0)).r;

    vec2 f = fract(st / tileSpanUV);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float textureSourceFbm(in vec2 st, in int octaves, float initialTileSize) {
    float value = 0.0;
    float amplitude = 0.5;
    float tileSize = initialTileSize;

    for(int i = 0; i < octaves; i++) {
        value += amplitude * textureSourceNoise(st, tileSize);
        tileSize *= .5;
        amplitude *= .5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;

    float f = textureSourceFbm(st, 6, 400.0);

    fragColor = vec4(vec3(f), 1);
}
