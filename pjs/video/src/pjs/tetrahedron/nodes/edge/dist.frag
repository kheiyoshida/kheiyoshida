#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uResolution;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 noise2(in vec2 st) {
    return vec2(
        noise(st * 2.0),
        noise(st * 3.0)
    );
}

#define OCTAVES 3
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

vec3 distTexture(in vec2 st) {
    vec2 adjacent = 1.0 / uResolution;

    vec2 n = vec2(fbm(st * 2.0),  fbm(st * 3.3));
    vec2 offsetLevel = (n - 0.5) * 2.0 * 8.0;

    return texture(uTexture, vUV + offsetLevel * adjacent).xyz;
}

void main() {
    vec2 st = gl_FragCoord.xy * 5.0 / uResolution;

//    float r = distTexture(st * 2.3).x;
    float g = distTexture(st * 3.5).y;
    float b = distTexture(st * 3.45).z;

    fragColor = vec4(0, g, b, 1);

//    fragColor = vec4(noise2(st), 0, 1);
}
