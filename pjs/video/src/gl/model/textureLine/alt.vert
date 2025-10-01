#version 300 es
precision highp float;

in vec2 aPixelCoord;    // normalized [0,1] pixel position (per instance)
flat out vec3 vColor;

uniform sampler2D uVideoTex;
uniform vec2 uResolution;
uniform float uTime;
uniform int uMaxDistance;
uniform int uVertical;

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
    int distance = int(ceil(random(texCoord) * float(uMaxDistance)) - 0.5);

    bool vertical = uVertical == 1;
    vec2 offset = vertical ? vec2(0, distance) : vec2(distance, 0);

    vec2 remotePosition = position + offset / uResolution;
    vec2 remoteTexCoord = texCoord + offset / uResolution;
    bool isWithin = remoteTexCoord.x > 0.0 && remoteTexCoord.x < 1.0 && remoteTexCoord.y > 0.0 && remoteTexCoord.y < 1.0;

    bool edge = false;

    if (isWithin) {
        float remoteLuminance = luminance(texture(uVideoTex, remoteTexCoord).rgb);
        if (abs(remoteLuminance - lum) > uLuminanceThreshold) {
            edge = true;
        }
    }

    vec2 pos;
    if (gl_VertexID % 2 == 0) {
        pos = position * 2.0 - 1.0; // NDC [-1,1]
    } else {
        if (edge) {
            pos = remotePosition * 2.0 - 1.0;
        } else {
            pos = position * 2.0 - 1.0;
        }
    }
    gl_Position = vec4(pos, 0.0, 1.0);
    vColor = vec3(lum);
}
