#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aTriA;
in vec3 aTriB;
in vec3 aTriC;

out vec3 vPos;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform float uTime;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 random2(float id, float offset) {
    return vec2(
        random(vec2(id, offset + 1.0)),
        random(vec2(id, offset + 2.0))
    );
}

// mirror-repeat a value into [0, 1] range
float mirror01(float x) {
    float m = mod(x, 2.0);
    if (m < 0.0) m += 2.0;
    return 1.0 - abs(m - 1.0);
}

vec2 foldToTriangle(vec2 p) {
    p.x = mirror01(p.x);
    p.y = mirror01(p.y);

    if (p.x + p.y > 1.0) {
        p = vec2(1.0 - p.y, 1.0 - p.x);
    }

    return p;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 10.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, vec3(C.y)));
    vec3 x0 = v - i + dot(i, vec3(C.x));

    // Other corners
    vec3 g = step(vec3(x0.yzx), x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    // x0 = x0 - 0.0 + 0.0 * C.x
    vec3 x1 = x0 - i1 + 1.0 * C.x;
    vec3 x2 = x0 - i2 + 2.0 * C.x;
    vec3 x3 = x0 - 1.0 + 3.0 * C.x;

    // Permutations
    i = mod289(i);
    vec4 p = permute(
    permute(
    permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 g0 = vec3(a0.xy, h.x);
    vec3 g1 = vec3(a0.zw, h.y);
    vec3 g2 = vec3(a1.xy, h.z);
    vec3 g3 = vec3(a1.zw, h.w);

    // Normalize gradients
    vec4 norm = taylorInvSqrt(vec4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
    g0 *= norm.x;
    g1 *= norm.y;
    g2 *= norm.z;
    g3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;

    return 42.0 * dot(m * m, vec4(dot(g0, x0), dot(g1, x1), dot(g2, x2), dot(g3, x3)));
}

void main() {
    float id = float(gl_InstanceID);

    float r1 = random(vec2(id, 17.0));
    float r2 = random(vec2(id, 53.0));

    float s = sqrt(r1);
    vec2 p0 = vec2(
        s * (1.0 - r2), // beta
        s * r2          // gamma
    );

    vec2 dir = random2(id, 101.0) * 2.0 - 1.0;
    dir = normalize(dir);

    float speed = mix(0.05, 0.2, random(vec2(id, 77.0)));
    vec2 p = foldToTriangle(p0 + dir * speed * (uTime * 180.0));

    float beta  = p.x;
    float gamma = p.y;
    float alpha = 1.0 - beta - gamma;

    vec3 randomPosOnTri = alpha * aTriA + beta * aTriB + gamma * aTriC;
    vec3 randomPosOnTriWS = (uModel * vec4(randomPosOnTri, 1.0)).xyz;

    float n = snoise(randomPosOnTriWS + vec3(uTime * 2.0));

    vec3 particlePos = aPosition + randomPosOnTri;

    vec3 perpendicular = cross(aTriB - aTriA, aTriC - aTriA);
    vec3 finalPos = particlePos + perpendicular * n * 0.2 * sin(uTime * 2.0);

    vec4 modelPos = uModel * vec4(finalPos, 1.0);
    vPos = modelPos.xyz;
    gl_Position   = uProjection * uView * modelPos;
}
