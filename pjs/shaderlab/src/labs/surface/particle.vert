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

void main() {
    float id = float(gl_InstanceID);

    float r1 = fract(random(vec2(id, 17.0)) + uTime);
    float r2 = fract(random(vec2(id, 53.0)) + uTime);

    float s = sqrt(r1);
    float alpha = 1.0 - s;
    float beta = s * (1.0 - r2);
    float gamma = s * r2;

    vec3 randomPosOnTri = alpha * aTriA + beta * aTriB + gamma * aTriC;

    vec3 particlePos = aPosition + randomPosOnTri;

    vec4 modelPos = uModel * vec4(particlePos, 1.0);
    vPos = modelPos.xyz;
    gl_Position   = uProjection * uView * modelPos;
}
