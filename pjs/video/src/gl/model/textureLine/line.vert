#version 300 es
precision highp float;

in vec2 aPixelCoord;    // normalized [0,1] pixel position (per instance)
flat out vec3 vColor;

uniform sampler2D uVideoTex;
uniform vec2 uResolution;

// gl_VertexID % 2: 0 = start, 1 = end
void main() {
    // Convert to texture space
    vec2 texCoord = vec2(aPixelCoord.x, aPixelCoord.y);

    // Sample luminance at this pixel
    vec3 color = texture(uVideoTex, vec2(texCoord.x, 1.0 - texCoord.y)).rgb;
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));

    float luminanceThreshold = 0.2;
    if (lum >= luminanceThreshold) return;

    int offsetDist = 8;
    int halfOD = int(offsetDist / 2);
    // Pick a neighbor offset based on pixel coord hash
    // (so it's stable across frames, not random per draw)
    ivec2 offsets[8] = ivec2[8](
        ivec2(offsetDist, 0),
        ivec2(0, offsetDist),
        ivec2(-offsetDist, 0),
        ivec2(0, -offsetDist),
        ivec2(halfOD, halfOD),
        ivec2(-halfOD, halfOD),
        ivec2(halfOD, -halfOD),
        ivec2(-halfOD, -halfOD)
    );

    int firstChoice = int(
        mod(float(int(texCoord.x*uResolution.x) + int(texCoord.y*uResolution.y)), 8.0)
    );

    int i = 0;
    bool foundSimilar = false;
    vec2 neighborCoord;
    for (i = 0; i <= 8; i++) {

        ivec2 offset = offsets[firstChoice];

        // Neighbor texcoord
        neighborCoord = texCoord + vec2(offset) / uResolution;
        vec3 neighborColor = texture(uVideoTex, vec2(texCoord.x, 1.0 - texCoord.y)).rgb;
        float neighborLum = dot(neighborColor, vec3(0.2126, 0.7152, 0.0722));

        // Test similarity
        float threshold = 0.05; // tweak
        foundSimilar = abs(lum - neighborLum) < threshold;
    }

    vec2 pos;
    if (gl_VertexID % 2 == 0) {
        pos = texCoord * 2.0 - 1.0; // NDC [-1,1]
    } else {
        if (foundSimilar) {
            pos = neighborCoord * 2.0 - 1.0;
        } else {
            // collapse line to start → invisible
            pos = texCoord * 2.0 - 1.0;
        }
    }

    gl_Position = vec4(pos, 0.0, 1.0);

    vColor = color * 3.0; // or mix with neighborColor
}
