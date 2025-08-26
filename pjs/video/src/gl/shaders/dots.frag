#version 300 es
precision mediump float;
in vec2 vUV;
out vec4 fragColor;

void main() {
    float d = length(vUV - vec2(0.5));
    float alpha = smoothstep(0.5, 0.45, d);
    fragColor = vec4(1.0, 1.0, 1.0, alpha);
//    fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
