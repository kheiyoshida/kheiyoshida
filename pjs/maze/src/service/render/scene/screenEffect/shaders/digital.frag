#version 300 es

precision highp float;

out vec4 fragColor;

in vec2 TexCoords;

uniform sampler2D ColorTexture;
uniform sampler2D NormalTexture;
uniform sampler2D DepthTexture;

// common uniforms
uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uBaseColor;
uniform float uFadeoutPercentage;

// shader-specific
uniform float uRandomizationLevel;
uniform float uEdgeRenderingLevel;

vec3 applyFade(vec3 processedColor) {
    if (uFadeoutPercentage == 0.0) return processedColor;
    return mix(processedColor, uBaseColor, uFadeoutPercentage);
}

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233)) + uTime) * 43758.5453123);
}

// Convert back to [-1, 1] range
vec3 convertNormalToOriginalRange(vec4 normalSample) {
    return normalSample.rgb * 2.0 - 1.0;
}

bool detectEdge() {
    if (TexCoords.x > 0.99 || TexCoords.x < 0.01 || TexCoords.y > 0.99 || TexCoords.y < 0.01) return false;

    vec4 normalSample = texture(NormalTexture, TexCoords);

    float noiseVal = random(vec2(gl_FragCoord.x, gl_FragCoord.y));
    float offset = (noiseVal) / 691.0; // depth texture resolution = canvas.width

    // sample the color value off color texture(i.e. offscreen buffer)
    vec3 normalCenter = convertNormalToOriginalRange(texture(NormalTexture, TexCoords));
    vec3 normalLeft   = convertNormalToOriginalRange(texture(NormalTexture, TexCoords + vec2(-offset, 0.0)));
    vec3 normalRight  = convertNormalToOriginalRange(texture(NormalTexture, TexCoords + vec2(offset, 0.0)));
    vec3 normalAbove  = convertNormalToOriginalRange(texture(NormalTexture, TexCoords + vec2(0.0, offset)));
    vec3 normalBelow  = convertNormalToOriginalRange(texture(NormalTexture, TexCoords + vec2(0.0, -offset)));

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
        float depthCenter = texture(DepthTexture, TexCoords).r;

        // Sample the depth values of adjacent pixels
        float depthLeft   = texture(DepthTexture, TexCoords + vec2(-offset, 0.0)).r;
        float depthRight  = texture(DepthTexture, TexCoords + vec2(offset, 0.0)).r;
        float depthAbove  = texture(DepthTexture, TexCoords + vec2(0.0, offset)).r;
        float depthBelow  = texture(DepthTexture, TexCoords + vec2(0.0, -offset)).r;

        // Compare depth values to detect edges
        float edgeThreshold = 0.001;// Define a threshold for edge detection
        bool isEdge = (abs(depthCenter - depthLeft) > edgeThreshold ||
        abs(depthCenter - depthRight) > edgeThreshold ||
        abs(depthCenter - depthAbove) > edgeThreshold ||
        abs(depthCenter - depthBelow) > edgeThreshold);
        return isEdge;
    }
}

vec3 getRandomizedColor() {
    vec3 originalColor = vec3(texture(ColorTexture, TexCoords));

    vec3 normal = convertNormalToOriginalRange(texture(NormalTexture, TexCoords));

    vec3 randomVector = vec3(
    random(TexCoords * (normal.rg + originalColor.gb)),
    random(TexCoords * (normal.gb + originalColor.rb)),
    random(TexCoords * (normal.rb + originalColor.rg))
    );

    vec3 colorDelta;
    float minimum = clamp(min(min(randomVector.r, randomVector.g), randomVector.b), 0.0, 0.5);
    colorDelta = vec3(
        min(randomVector.r, minimum + 0.1),
        min(randomVector.g, minimum + 0.1),
        min(randomVector.b, minimum + 0.1)
    );
    colorDelta = (colorDelta - 0.5) * 2.0; // noramlize to [-1, 1] range
    return colorDelta;
}

const float edgeStrokeColorDiff = 0.5;

void main() {
    vec3 originalColor = vec3(texture(ColorTexture, TexCoords));

    vec3 lineColor;
    if (originalColor.x > 0.5 && originalColor.y > 0.5 && originalColor.z > 0.5) {
        lineColor = originalColor - edgeStrokeColorDiff;
    } else {
        lineColor = originalColor + edgeStrokeColorDiff;
    }

    vec3 finalColor;
    vec3 colorDelta = getRandomizedColor() * mix(0.3, 0.8, uRandomizationLevel);
    finalColor = originalColor + colorDelta;

    float lineRatio = uEdgeRenderingLevel;

    bool isEdge = detectEdge();

    if(isEdge) {
        finalColor = mix(finalColor, lineColor, lineRatio);
    } else {
        finalColor = mix(originalColor, finalColor, lineRatio);
    }

    fragColor = vec4(applyFade(finalColor), 1.0);
}
