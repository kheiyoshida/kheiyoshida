#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture; // texture result from feature detection pass
uniform vec2 uFeaturePassTexelSize;

uniform float uTileSize;
uniform int uSearchRadius;
uniform float uDiffThreshold;

void main() {
    vec4 centerFeature = texture(uTexture, vUV);

    float centerDiffX = centerFeature.b;
    float centerDiffY = centerFeature.a;

    int radius = uSearchRadius;

    float diffThreshold = uDiffThreshold;

    float bestFeatureDiff = diffThreshold;
    vec2 bestFeatureUV;

    float secondBestFeatureDiff = diffThreshold;
    vec2 secondBestFeatureUV;

    for(int r = 1; r <= radius; r++) {
        for(int signX = -1; signX <=1; signX+=2) {
            for(int signY = -1; signY <=1; signY+=2) {
                int x = signX * r;
                int y = signY * r;

                vec2 targetTileUV = vUV + vec2(x,y) * uFeaturePassTexelSize;
                vec4 targetTileFeature = texture(uTexture, targetTileUV);

                float diffX = targetTileFeature.b;
                float diffY = targetTileFeature.a;
                if (diffX == 0.0 && diffY == 0.0) continue;

                float diff = abs(centerDiffX - diffX) + abs(centerDiffY - diffY);
                if (diff < bestFeatureDiff) {
                    secondBestFeatureDiff = bestFeatureDiff;
                    secondBestFeatureUV = secondBestFeatureUV;

                    bestFeatureDiff = diff;
                    bestFeatureUV = targetTileFeature.rg;
                }
                else if (diff < secondBestFeatureDiff) {
                    secondBestFeatureDiff = diff;
                    secondBestFeatureUV = targetTileFeature.rg;
                }
            }
        }
        if (bestFeatureDiff != diffThreshold && secondBestFeatureDiff != diffThreshold) break;
    }

    if (bestFeatureDiff == diffThreshold) {
        fragColor = vec4(0);
        return;
    } else if (secondBestFeatureDiff == diffThreshold) {
        secondBestFeatureUV = bestFeatureUV;
    }

    fragColor = vec4(bestFeatureUV, secondBestFeatureUV);
}
