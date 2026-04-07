#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uResolution;
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

// fractal brownian motion
// https://thebookofshaders.com/13
float fbm (in vec2 st, in int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.;

    for (int i = 0; i < octaves; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= .5;
    }
    return value;
}

float signVal(float v) {
    return (v - 0.5) * 2.0;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;
    st *= 2.0;

//    vec2 q = vec2(fbm(st, 5));
//    vec2 r;
//    r.x = fbm(st + q + 0.020 * uTime, 5);
//    r.y = fbm(st + q + 0.136 * uTime, 5);
    float fx = fbm(st * 2.5 , 2);
    float fy = fbm(st * 4.5 , 2);

    float ux = 1.0 / uResolution.x;
    float uy = 1.0 / uResolution.y;

    float strength = 100.0;
    vec2 remoteUV = vUV + vec2(signVal(fx) * ux, signVal(fy) * uy) * strength;
    vec3 color = texture(uTexture, remoteUV).rgb;

    fragColor = vec4(color, 1);
}
