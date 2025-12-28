#version 300 es

precision highp float;

layout (location=0) out vec4 fragColor;// To COLOR_ATTACHMENT0

in vec2 vUV;

uniform sampler2D uColorTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uDepthTexture;

layout (std140) uniform Effect
{
    float uTime;
    vec3 uResolution;
};

layout (std140) uniform Color
{
    vec3 uBaseColor;
};

// shader-specific
uniform float uEdgeRenderingLevel;

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233)) + uTime) * 43758.5453123);
}

// Convert back to [-1, 1] range
vec3 convertNormalToOriginalRange(vec4 normalSample) {
    return normalSample.rgb * 2.0 - 1.0;
}

bool detectEdge() {
    if (vUV.x > 0.99 || vUV.x < 0.01 || vUV.y > 0.99 || vUV.y < 0.01) return false;

    vec4 normalSample = texture(uNormalTexture, vUV);

    float noiseVal = random(vec2(gl_FragCoord.x, gl_FragCoord.y));
    float offset = (noiseVal) / 691.0; // depth texture resolution = canvas.width

    // sample the color value off color texture(i.e. offscreen buffer)
    vec3 normalCenter = convertNormalToOriginalRange(texture(uNormalTexture, vUV));
    vec3 normalLeft   = convertNormalToOriginalRange(texture(uNormalTexture, vUV + vec2(-offset, 0.0)));
    vec3 normalRight  = convertNormalToOriginalRange(texture(uNormalTexture, vUV + vec2(offset, 0.0)));
    vec3 normalAbove  = convertNormalToOriginalRange(texture(uNormalTexture, vUV + vec2(0.0, offset)));
    vec3 normalBelow  = convertNormalToOriginalRange(texture(uNormalTexture, vUV + vec2(0.0, -offset)));

    float edgeThreshold = 0.5; //
    bool isCreaseEdgeRendered = (
    dot(normalCenter, normalLeft)  < edgeThreshold ||
    dot(normalCenter, normalRight) < edgeThreshold ||
    dot(normalCenter, normalAbove) < edgeThreshold ||
    dot(normalCenter, normalBelow) < edgeThreshold
    );

    if (isCreaseEdgeRendered) {
        return true;
    } else {
        // Sample the depth value of the current pixel
        float depthCenter = texture(uDepthTexture, vUV).r;

        // Sample the depth values of adjacent pixels
        float depthLeft   = texture(uDepthTexture, vUV + vec2(-offset, 0.0)).r;
        float depthRight  = texture(uDepthTexture, vUV + vec2(offset, 0.0)).r;
        float depthAbove  = texture(uDepthTexture, vUV + vec2(0.0, offset)).r;
        float depthBelow  = texture(uDepthTexture, vUV + vec2(0.0, -offset)).r;

        // Compare depth values to detect edges
        float edgeThreshold = 0.001;// Define a threshold for edge detection
        bool isEdge = (abs(depthCenter - depthLeft) > edgeThreshold ||
        abs(depthCenter - depthRight) > edgeThreshold ||
        abs(depthCenter - depthAbove) > edgeThreshold ||
        abs(depthCenter - depthBelow) > edgeThreshold);
        return isEdge;
    }
}

const float edgeStrokeColorDiff = 0.5;

void main() {
    vec3 originalColor = vec3(texture(uColorTexture, vUV));

    vec3 lineColor;
    if (originalColor.x > 0.5 && originalColor.y > 0.5 && originalColor.z > 0.5) {
        lineColor = originalColor - edgeStrokeColorDiff;
    } else {
        lineColor = originalColor + edgeStrokeColorDiff;
    }

    bool isEdge = detectEdge();

    vec3 finalLineColor = mix(originalColor, lineColor, uEdgeRenderingLevel);
    vec3 finalColor = isEdge ? finalLineColor : originalColor;

    fragColor = vec4(finalColor, 1.0);
}
