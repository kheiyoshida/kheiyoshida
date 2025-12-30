#version 300 es
precision mediump float;

out vec3 vNormal;
out vec3 fragPos;

layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec3 aNormal;

uniform mat4 model;

layout (std140) uniform Eye
{
    mat4 projection;
    mat4 view;
    float far;
};

layout (std140) uniform DeformedBox
{
    vec3 FBL, FBR, FTL, FTR, BBL, BBR, BTL, BTR;

    vec3 normalTop;
    vec3 normalBottom;
    vec3 normalRight;
    vec3 normalLeft;
    vec3 normalFront;
    vec3 normalBack;
};

vec3 debugValue;

float calcDistanceFromVertexToPlane(vec3 vertex, vec3 facePoint, vec3 faceNormal) {
    vec3 vectorToPoint = facePoint - vertex;
    return abs(dot(faceNormal, vectorToPoint));
}

vec3 blendBoxNormalsForAVertex(vec3 vertex) {
    vec3 faceNormals[6];
    faceNormals[0] = normalTop;
    faceNormals[1] = normalBottom;
    faceNormals[2] = normalRight;
    faceNormals[3] = normalLeft;
    faceNormals[4] = normalFront;
    faceNormals[5] = normalBack;

    float faceDistances[6];
    faceDistances[0] = calcDistanceFromVertexToPlane(vertex, FBR, normalTop); // swap FBR & FTR for now
    faceDistances[1] = calcDistanceFromVertexToPlane(vertex, FTR, normalBottom);

    faceDistances[2] = calcDistanceFromVertexToPlane(vertex, BBR, normalRight);
    faceDistances[3] = calcDistanceFromVertexToPlane(vertex, BTL, normalLeft);
    faceDistances[4] = calcDistanceFromVertexToPlane(vertex, FBL, normalFront);
    faceDistances[5] = calcDistanceFromVertexToPlane(vertex, BTR, normalBack);

    // Compute the sum of distances
    float distSum = 0.0;
    for (int i = 0; i < 6; i++) {
        distSum += faceDistances[i];
    }

    // Blend the normals
    vec3 result = vec3(0.0);
    for (int i = 0; i < 6; i++) {
        float weight = distSum / (faceDistances[i] + 1e-6);// Compute weight

        result += faceNormals[i] * weight;// Weighted sum
    }

    debugValue = vec3(faceDistances[2] / distSum);

    // Normalize the result to get the final blended normal
    return normalize(result);
}

// normal direction identifiers
const vec3 dTop = vec3(0.0, 1.0, 0.0);
const vec3 dBottom = vec3(0.0, -1.0, 0.0);
const vec3 dRight = vec3(1.0, 0.0, 0.0);
const vec3 dLeft = vec3(-1.0, 0.0, 0.0);
const vec3 dFront = vec3(0.0, 0.0, 1.0);
const vec3 dBack = vec3(0.0, 0.0, -1.0);
const vec3 dNone = vec3(0.0);

vec3 determineFaceNormal(vec3 vertexNormal) {
    if (vertexNormal == dTop) return normalTop;
    if (vertexNormal == dBottom) return normalBottom;
    if (vertexNormal == dRight) return normalRight;
    if (vertexNormal == dLeft) return normalLeft;
    if (vertexNormal == dFront) return normalFront;
    if (vertexNormal == dBack) return normalBack;
    return dNone;
}

bool isVertexOnEdge(vec3 vertex) {
    for(int i = 0; i < 3; i++) {
        if (vertex[i] != 1.0 && vertex[i] != -1.0) {
            return false;
        }
    }
    return true;
}

void main() {
    vec3 modelTransformedPosition = vec3(model * vec4(aPosition, 1.0));

    vec3 normalizedPosition = (modelTransformedPosition + vec3(1.0)) * 0.5;

    vec3 transformedPosition =
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (normalizedPosition.z) * FBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (normalizedPosition.z) * FBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (normalizedPosition.z) * FTL +
    normalizedPosition.x * normalizedPosition.y * (normalizedPosition.z) * FTR +
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * BBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * BBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (1.0-normalizedPosition.z) * BTL +
    normalizedPosition.x * normalizedPosition.y * (1.0 - normalizedPosition.z) * BTR;

    bool isPositionOnEdge = isVertexOnEdge(aPosition);
    if (isPositionOnEdge) {
        vNormal = aNormal;
    } else {
        vec3 positionsFaceNormal = determineFaceNormal(aNormal);
        if (positionsFaceNormal != dNone) {
            vNormal = normalize(positionsFaceNormal);
        } else {
            vNormal = mix(aNormal, blendBoxNormalsForAVertex(normalizedPosition), 0.5);
        }
    }

    fragPos = transformedPosition;
    gl_Position = projection * view * vec4(transformedPosition, 1.0);
}
