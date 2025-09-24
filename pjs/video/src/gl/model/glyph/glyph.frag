#version 300 es

precision mediump float;

in vec3 vColor;
in vec2 vUv;

uniform sampler2D uFontAtlas;
out vec4 fragColor;

void main() {
    vec4 col = texture(uFontAtlas, vUv);
    float alpha = col.a;
    if (alpha < 0.01) {
        discard;
    }
    else {
        fragColor = vec4(vColor.x, vColor.y, vColor.z, alpha);
    }
}
