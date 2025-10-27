#version 300 es
precision highp float;

layout (location=0) out vec4 fragColor;// To COLOR_ATTACHMENT0
layout (location=1) out vec4 fragNormal;// To COLOR_ATTACHMENT1

struct Material {
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

in vec3 vNormal;
in vec3 fragPos;

uniform Material material;

struct PointLight {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};

struct SpotLight {
    vec3 position;
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec4 specular;// vec4 to make sure the last 4 bytes pad

    float cutOff;
    float outerCutOff;

    float constant;
    float linear;
    float quadratic;
};

layout (std140) uniform Lights
{
    vec4 viewPos;
    PointLight pointLights[2];
    SpotLight spotLight;
};

layout (std140) uniform Color
{
    vec3 unlitColor;
};

layout (std140) uniform Effect
{
    float fogLevel;
};

const float fogNear = 0.0;
const float minFogFar = 0.1;
const float fogFarRange = 2.5;

const float distanceDiff = 0.4;

void main()
{
    vec3 norm = normalize(vNormal);

    vec3 viewPosToFragment = viewPos.xyz - fragPos;

    vec3 closeColor;
    vec3 farColor = unlitColor;

    if (farColor.x > 0.5 && farColor.y > 0.5 && farColor.z > 0.5) {
        closeColor = farColor - distanceDiff;
    } else {
        closeColor = farColor + distanceDiff;
    }

//    vec3 closeColor = vec3(1.0, 0.0, 0.0);
//    vec3 farColor = vec3(0.0, 1.0, 0.0);

    // distance fog
    float distance = length(viewPosToFragment);
    float fogFar = minFogFar + fogLevel * fogFarRange;

//    float fogFactor = clamp((distance - fogNear) / (fogFar - fogNear), 0.0, 1.0);

    float fogFactor = 0.01 + clamp(1.0 - exp(-distance * pow(3.0, fogLevel)), 0.0, 0.99);

    vec3 finalColor = mix(closeColor, farColor, fogFactor);

    fragColor = vec4(finalColor, 1.0);

    fragNormal = vec4(norm * 0.5 + 0.5, 1.0);
}
