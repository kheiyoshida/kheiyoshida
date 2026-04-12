#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uDepthTexture;

uniform vec2 uResolution;

vec3 convertNormalToOriginalRange(vec4 normalSample) {
    return normalSample.rgb * 2.0 - 1.0;
}

void main() {
    vec4 c = texture(uDepthTexture, vUV);
//    fragColor = vec4(c.x, 0, 0, 1);

    vec2 offset = 1.0 / uResolution;
    vec3 normalCenter = convertNormalToOriginalRange(texture(uNormalTexture, vUV));
    vec3 normalLeft   = convertNormalToOriginalRange(texture(uNormalTexture, vUV + offset * vec2(-1.0, 0.0)));
    vec3 normalRight  = convertNormalToOriginalRange(texture(uNormalTexture, vUV + offset * vec2(1.0, 0.0)));
    vec3 normalAbove  = convertNormalToOriginalRange(texture(uNormalTexture, vUV + offset * vec2(0.0, 1.0)));
    vec3 normalBelow  = convertNormalToOriginalRange(texture(uNormalTexture, vUV + offset * vec2(0.0, -1.0)));

    float edgeThreshold = 0.5; //
    bool isCreaseEdgeRendered = (
        dot(normalCenter, normalLeft)  < edgeThreshold ||
        dot(normalCenter, normalRight) < edgeThreshold ||
        dot(normalCenter, normalAbove) < edgeThreshold ||
        dot(normalCenter, normalBelow) < edgeThreshold
    );

    if (isCreaseEdgeRendered) {
        fragColor = vec4(1.0);
    } else {
        float dx = offset.x;
        float dy = offset.y;
        float center = texture(uTexture, vUV).r;
        float right = texture(uTexture, vUV + vec2(dx, 0.0)).r;
        float left = texture(uTexture, vUV + vec2(-dx, 0.0)).r;
        float up = texture(uTexture, vUV + vec2(0.0, dy)).r;
        float down = texture(uTexture, vUV + vec2(0.0, -dy)).r;

        float threshold = 0.001;
        bool isDepthBorder = (
        abs(center - right) > threshold ||
        abs(center - left) > threshold ||
        abs(center - up) > threshold ||
        abs(center - down) > threshold
        );

        if (isDepthBorder) {
            fragColor = vec4(1.0);
        } else {
//            fragColor = vec4(texture(uTexture, vUV));
            fragColor = vec4(vec3(0.1), 1.0);
        }
    }
}
