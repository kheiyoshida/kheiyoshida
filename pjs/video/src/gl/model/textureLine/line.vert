#version 300 es
precision highp float;

in vec2 aPixelCoord;    // normalized [0,1] pixel position (per instance)
flat out vec3 vColor;

uniform sampler2D uVideoTex;
uniform vec2 uResolution;
uniform float uTime;
uniform int uMaxDistance;

uniform float uLuminanceThreshold;

// out: [0, 1]
float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233)) + uTime) * 43758.5453123);
}

float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

// gl_VertexID % 2: 0 = start, 1 = end
void main() {
    vec2 position = vec2(aPixelCoord);
    vec2 texCoord = vec2(aPixelCoord.x,  aPixelCoord.y);

    // Sample luminance at this pixel
    vec3 color = texture(uVideoTex, texCoord).rgb;
    float lum = luminance(color);

    // 1 ~ maxDistance
    int distance = int(ceil(random(texCoord) * float(uMaxDistance)));
    if (distance <= 0) {
        distance = 1;
    }

    int another = int(ceil(random(texCoord * uResolution) * float(uMaxDistance)));
    int rx = distance - another;
    int ry = another;
    vec2 offset = vec2(rx, ry);

    vec2 remotePosition = position + offset / uResolution;
    vec2 remoteTexCoord = texCoord + offset / uResolution;

    float remoteLuminance = luminance(texture(uVideoTex, remoteTexCoord).rgb);

    bool similar = false;
    if (abs(remoteLuminance - lum) < uLuminanceThreshold) {
        similar = true;
    }

    vec2 pos;
    if (gl_VertexID % 2 == 0) {
        pos = position * 2.0 - 1.0; // NDC [-1,1]
    } else {
        if (similar) {
            pos = remotePosition * 2.0 - 1.0;
        } else {
            pos = position * 2.0 - 1.0;
        }
    }
    gl_Position = vec4(pos, 0.0, 1.0);
    vColor = vec3(color);
}
