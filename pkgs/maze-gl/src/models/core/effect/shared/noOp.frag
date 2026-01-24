#version 300 es
precision mediump float;

in vec2 vUV;

layout (location=0) out vec4 fragColor;// To COLOR_ATTACHMENT0
layout (location=1) out vec4 fragNormal;// To COLOR_ATTACHMENT1

uniform sampler2D uColorTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uDepthTexture;

void main() {
    fragColor = texture(uNormalTexture, vUV);
    fragColor = texture(uColorTexture, vUV);

//    float d = texture(uDepthTexture, vUV).r;
//    d = pow(d, 20.0);
//    fragColor = vec4(vec3(d), 1.0);

    fragNormal = vec4(1, 1, 1, 1);
}
