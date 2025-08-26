#version 300 es
in vec2 aPosition;   // quad corner
in vec3 aInstance;   // dot center

uniform float uRadius;

out vec2 vUV;
out float brightness;

void main() {
    vec2 scaled = aPosition * uRadius;

    vec2 world = aInstance.xy + scaled;
    gl_Position = vec4(world * 2.0 - 1.0, 0.0, 1.0);
    vUV = aPosition + 0.5;
    brightness = aInstance.z;
}
