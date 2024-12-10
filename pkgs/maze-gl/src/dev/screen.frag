#version 300 es

precision highp float;

out vec4 fragColor;

in vec2 TexCoords;

uniform sampler2D DepthTexture;
uniform sampler2D ColorTexture;

const vec4 drawColor = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 bgColor = vec4(1.0, 1.0, 1.0, 1.0);

float random(vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Convert back to [-1, 1] range
vec3 convertNormalToOriginalRange(vec4 normalSample) {
    return normalSample.rgb * 2.0 - 1.0;
}

void main() {
    vec4 normalSample = texture(ColorTexture, TexCoords);

//        float noiseVal = random(vec2(gl_FragCoord.x, gl_FragCoord.y));
    float noiseVal = 0.0;
    float offset = (1.0 + noiseVal) / 800.0;// Adjust based on your depth texture resolution

    // sample the color value off color texture(i.e. offscreen buffer)
    vec3 normalCenter = convertNormalToOriginalRange(texture(ColorTexture, TexCoords));
    vec3 normalLeft   = convertNormalToOriginalRange(texture(ColorTexture, TexCoords + vec2(-offset, 0.0)));
    vec3 normalRight  = convertNormalToOriginalRange(texture(ColorTexture, TexCoords + vec2(offset, 0.0)));
    vec3 normalAbove  = convertNormalToOriginalRange(texture(ColorTexture, TexCoords + vec2(0.0, offset)));
    vec3 normalBelow  = convertNormalToOriginalRange(texture(ColorTexture, TexCoords + vec2(0.0, -offset)));

    float edgeThreshold = 0.3; //
    bool isCreaseEdgeRendered = (
    dot(normalCenter, normalLeft)  < edgeThreshold ||
    dot(normalCenter, normalRight) < edgeThreshold ||
    dot(normalCenter, normalAbove) < edgeThreshold ||
    dot(normalCenter, normalBelow) < edgeThreshold
    );

    if (isCreaseEdgeRendered) {
        fragColor = drawColor;
    } else {
        // Sample the depth value of the current pixel
        float depthCenter = texture(DepthTexture, TexCoords).r;

        // Sample the depth values of adjacent pixels
        float depthLeft   = texture(DepthTexture, TexCoords + vec2(-offset, 0.0)).r;
        float depthRight  = texture(DepthTexture, TexCoords + vec2(offset, 0.0)).r;
        float depthAbove  = texture(DepthTexture, TexCoords + vec2(0.0, offset)).r;
        float depthBelow  = texture(DepthTexture, TexCoords + vec2(0.0, -offset)).r;

        // Compare depth values to detect edges
        float edgeThreshold = 0.01;// Define a threshold for edge detection
        bool isEdge = (abs(depthCenter - depthLeft) > edgeThreshold ||
        abs(depthCenter - depthRight) > edgeThreshold ||
        abs(depthCenter - depthAbove) > edgeThreshold ||
        abs(depthCenter - depthBelow) > edgeThreshold);

        // Set fragment color based on whether it's an edge or not
        fragColor = isEdge ? drawColor : bgColor;
    }
}

