precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D(uTexture, vUV);
//    gl_FragColor = vec4(vUV, 0.5 + 0.5 * sin(vUV.x * 10.0), 1.0); // gradient
}
