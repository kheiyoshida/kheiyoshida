#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture; // texture result from feature detection pass
uniform vec2 uFeaturePassTexelSize;

uniform float uTileSize;
uniform int uSearchRadius;

void main() {
    int radius = uSearchRadius;

    float bestFeatureScore = -1.0;
    vec2 bestFeatureUV;

    float secondBestFeatureScore = -1.0;
    vec2 secondBestFeatureUV;

    vec2 bestOffset;

    for(int r = 1; r <= radius; r++) {
        for(int signX = -1; signX <=1; signX++) {
            for(int signY = -1; signY <=1; signY++) {
                int x = signX * r;
                int y = signY * r;

                vec2 targetTileUV = vUV + vec2(x,y) * uFeaturePassTexelSize;
                vec4 targetTileFeature = texture(uTexture, targetTileUV);
                if (targetTileFeature.a == 0.0) continue;

                float score = targetTileFeature.b;
                if (score > bestFeatureScore) {
                    secondBestFeatureScore = bestFeatureScore;
                    secondBestFeatureUV = secondBestFeatureUV;
                    bestFeatureScore = score;
                    bestFeatureUV = targetTileFeature.rg;
                    bestOffset = vec2(x,y);
                }
                else if (score > secondBestFeatureScore) {
                    secondBestFeatureScore = score;
                    secondBestFeatureUV = targetTileFeature.rg;
                }
            }
        }
        if (bestFeatureScore != -1.0 && secondBestFeatureScore != -1.0) break;
    }

//    for(int x = -radius; x <= radius; x++) {
//        for(int y = -radius; y <= radius; y++) {
//            if (x == 0 && y == 0) continue;
//
//            vec2 targetTileUV = vUV + vec2(x,y) * uFeaturePassTexelSize;
//            vec4 targetTileFeature = texture(uTexture, targetTileUV);
//            if (targetTileFeature.a == 0.0) continue;
//
//            float score = targetTileFeature.b;
//            if (score > bestFeatureScore) {
//                secondBestFeatureScore = bestFeatureScore;
//                secondBestFeatureUV = secondBestFeatureUV;
//                bestFeatureScore = score;
//                bestFeatureUV = targetTileFeature.rg;
//                bestOffset = vec2(x,y);
//            }
//            else if (score > secondBestFeatureScore) {
//                secondBestFeatureScore = score;
//                secondBestFeatureUV = targetTileFeature.rg;
//            }
//        }
//    }

    if (bestFeatureScore == -1.0) {
        fragColor = vec4(0);
        return;
    } else if (secondBestFeatureScore == -1.0) {
        secondBestFeatureUV = bestFeatureUV;
    }

    vec4 feature = texture(uTexture, vUV);
    fragColor = vec4(bestFeatureUV, secondBestFeatureUV);
}
