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

void main()
{
    vec3 norm = normalize(vNormal);

    fragColor = vec4(unlitColor, 1.0);

    fragNormal = vec4(norm * 0.5 + 0.5, 1.0);
}
