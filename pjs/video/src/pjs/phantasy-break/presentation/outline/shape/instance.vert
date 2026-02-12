#version 300 es

in vec2 aPos;

out vec4 vColour;

uniform sampler2D uColourTexture; // texture from the original video node

uniform float uTime;
uniform float uJitterLevel;

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233)) + uTime) * 43758.5453123);
}

void main() {
    vColour = texture(uColourTexture, aPos);

    vec2 pos = aPos;
    vec2 jitter = vec2(
        random(pos.xy),
        random(vec2(pos.y, pos.x))
    ) * uJitterLevel;
    pos += jitter;

    gl_Position = vec4(pos * 2.0 - 1.0, 0, 1);
}
