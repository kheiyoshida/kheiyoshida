precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;

void main() {
    vec3 color = texture2D(uTexture, vUV).rgb;
    float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722)); // luminance

    gl_FragColor = vec4(brightness, 0, 0, 1.0);

//    if (brightness > 0.4) {
//        gl_FragColor = vec4(brightness, 0, 0, 1.0);
//    } else {
//        gl_FragColor = vec4(0.0); // not bright
//    }
}
