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
    faceDistances[0] = calcDistanceFromVertexToPlane(vertex, FTR, normalTop);
    faceDistances[1] = calcDistanceFromVertexToPlane(vertex, FBR, normalBottom);
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

void main() {
    vec3 normalizedPosition = (aPosition + vec3(1.0)) * 0.5;
    vec3 transformedPosition =
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (normalizedPosition.z) * FBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (normalizedPosition.z) * FBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (normalizedPosition.z) * FTL +
    normalizedPosition.x * normalizedPosition.y * (normalizedPosition.z) * FTR +
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * BBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * BBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (1.0-normalizedPosition.z) * BTL +
    normalizedPosition.x * normalizedPosition.y * (1.0 - normalizedPosition.z) * BTR;

    vec3 blendedNormal = blendBoxNormalsForAVertex(transformedPosition);
    vNormal = mix(aNormal, blendedNormal, 0.12); // adjust the mix ratio

    fragPos = vec3(model * vec4(transformedPosition, 1.0));
    gl_Position = projection * view * vec4(fragPos, 1.0);
}
