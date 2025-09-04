#version 300 es

in vec2 aPos;

// instance attributes
in vec2 aOffset;
in vec3 aColor;
in float aSize;
in vec2 aUvMin;
in vec2 aUvMax;

out vec3 vColor;
out vec2 vUv;

void main() {
    vec2 scaled = aPos * aSize;
    vec2 world = aOffset + scaled;
    gl_Position = vec4(world * 2.0 - 1.0, 0, 1);
    vColor = aColor;

    float signX = aPos.x > 0.0 ? 1.0 : 0.0;
    float signY = aPos.y > 0.0 ? 0.0 : 1.0;

    vUv = mix(aUvMin, aUvMax, vec2(signX, signY));
}
