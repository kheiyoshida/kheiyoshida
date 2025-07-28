#version 300 es

precision mediump float;
in vec2 vUV;
uniform sampler2D uTexture;

out vec4 outColor;

void main() {
    vec3 color = texture(uTexture, vUV).rgb;
    float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722)); // luminance

//    outColor = vec4(brightness, 0, 0, 1.0);

    if (brightness > 0.5) {
        outColor = vec4(brightness, 0, 0, 1.0);
    } else {
        outColor = vec4(0.0); // not bright
    }
}
