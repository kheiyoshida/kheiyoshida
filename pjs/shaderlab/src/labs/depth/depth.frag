#version 300 es
precision highp float;

in vec3 vPos;
in vec3 vNormal;

layout(location=0) out vec4 fragColor;
layout (location=1) out vec4 fragNormal;

uniform sampler2D uDepthTexture;
uniform float uTime;

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

void main() {
    float depth = gl_FragCoord.z;

    vec2 st = vec2(vPos.x + vPos.z, vPos.y + vPos.z) + uTime;

    float n = noise(st * 10.0) * 0.1;

    const float division = 50.0;
    float color = floor((depth + n) * division) / division;

    fragColor = vec4(vec3(color), 1.0);
    fragNormal = vec4(vNormal, 1.0);
}
