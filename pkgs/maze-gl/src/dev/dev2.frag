#version 300 es
precision mediump float;

out vec4 fragColor;

in vec3 vColor;

void main() {
    fragColor = vec4(vColor, 1.0);
//    fragColor = vec4(0.0, gl_FragCoord.x/800.0, gl_FragCoord.y/800.0, 1.0);
}
