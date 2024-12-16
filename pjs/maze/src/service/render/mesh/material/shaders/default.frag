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

#define NR_POINT_LIGHTS 2

// calculates the color when using a point light.
vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);

    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);

    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(
    max(dot(viewDir, reflectDir), 0.0),
    material.shininess
    );

    // combine results
    vec3 ambient = light.ambient * material.diffuse;
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;

    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

    attenuation = clamp(attenuation, 0.01, 3.0); // prevent objects from being lit too much in close distance

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    return (ambient + diffuse + specular);
}

const float fogNear = 0.0;
const float minFogFar = 0.3;
const float fogFarRange = 2.5;

void main()
{
    vec3 norm = normalize(vNormal);

    vec3 viewPosToFragment = viewPos.xyz - fragPos;
    vec3 viewDir = normalize(viewPosToFragment);

    vec3 result = vec3(0.0);
    result += CalcPointLight(pointLights[0], norm, fragPos, viewDir);
    result += CalcPointLight(pointLights[1], norm, fragPos, viewDir);

    if (unlitColor.x > 0.5 && unlitColor.y > 0.5 && unlitColor.z > 0.5) {
        result = unlitColor - result;
    } else {
        result = unlitColor + result;
    }

    // distance fog
    float distance = length(viewPosToFragment);
    float fogFar = minFogFar + fogLevel * fogFarRange;
    float fogFactor = clamp((distance - fogNear) / (fogFar - fogNear), 0.0, 1.0);

    vec3 finalColor = mix(result, unlitColor, fogFactor);

    fragColor = vec4(finalColor, 1.0);

    fragNormal = vec4(norm * 0.5 + 0.5, 1.0);
}
