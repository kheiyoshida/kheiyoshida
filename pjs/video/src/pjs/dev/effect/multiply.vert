#version 300 es

in vec2 aPos;
in vec2 aUV;

// instance attributes
in vec2 aOffset;
uniform int uNum;

out vec2 vUV;

void main() {
    float num = float(uNum);
    vec2 gridCoord = aOffset; // e.g. (0..num-1)
    vec2 normalized = (gridCoord + 0.5) / num;
    vec2 center = normalized * 2.0 - 1.0;

    float size = 1.0 / num;
    vec2 scaled = aPos * size;
    gl_Position = vec4(center + scaled, 0.0, 1.0);
    vUV = aUV;
}
