#version 300 es

precision mediump float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTexture; // texture result from graident pass
uniform vec2 uGradientTexelSize; // greyscale pass size

uniform float uTileSize;

uniform float uThreshold;

// The output framebuffer size should be (uTexelSize.x/uTileSize, uTexelSize.y/uTileSize)

void main() {
    vec2 tileSpanUV = vec2(uTileSize * uGradientTexelSize.x, uTileSize * uGradientTexelSize.y);

    vec2 tileIndex = floor(vUV / tileSpanUV);
    vec2 tileOriginUV = tileIndex * tileSpanUV;

    float best = -1.0;
    ivec2 bestIJ = ivec2(0, 0);

    float bestDiffX = 0.0;
    float bestDiffY = 0.0;

    int TILE_H = int(uTileSize);
    int TILE_W = int(uTileSize);
    for(int j = 0; j < TILE_H; ++j) {
        for(int i = 0; i < TILE_W; ++i) {
            vec2 gradientTexelUV = tileOriginUV + vec2(float(i) * uGradientTexelSize.x, float(j) * uGradientTexelSize.y);

            vec4 fragment = texture(uTexture, gradientTexelUV);
            float score = fragment.r;

            if (score > best) {
                best = score;
                bestIJ = ivec2(i, j);

                bestDiffX = fragment.g;
                bestDiffY = fragment.b;
            }
        }
    }

    if (best < uThreshold) {
        fragColor = vec4(0.0);
        return;
    }

    vec2 offset01 = vec2(float(bestIJ.x)/uTileSize, float(bestIJ.y)/uTileSize) * tileSpanUV;

    vec2 position = tileOriginUV + offset01; // in greyscale pass dimension

    fragColor = vec4(position, bestDiffX, bestDiffY);
}
