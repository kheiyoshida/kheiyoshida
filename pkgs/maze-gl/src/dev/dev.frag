#version 300 es
precision mediump float;

layout(location=0) out vec4 fragColor;
layout(location=1) out vec4 fragNormal;

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
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
    // combine results
    vec3 ambient = light.ambient * material.diffuse;
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}

// calculates the color when using a spot light.
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
    // spotlight intensity
    float theta = dot(lightDir, normalize(light.direction));
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    // combine results
    vec3 ambient = light.ambient * material.diffuse;
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 specular = light.specular.xyz * spec * material.specular;
    ambient *= attenuation * intensity;
    diffuse *= attenuation * intensity;
    specular *= attenuation * intensity;
    return (ambient + diffuse + specular);
}

void main()
{
    vec3 normalizedNormal = normalize(vNormal);

    fragNormal = vec4(normalizedNormal * 0.5 + 0.5, 1.0);// transform to [0,1] range

    vec3 norm = normalize(vNormal);

    vec3 viewPosToFragment = viewPos.xyz - fragPos;
    vec3 viewDir = normalize(viewPosToFragment);

    vec3 result = vec3(0.0);
    result += CalcPointLight(pointLights[0], norm, fragPos, viewDir);
    result += CalcPointLight(pointLights[1], norm, fragPos, viewDir);
    //    result += CalcSpotLight(spotLight, norm, fragPos, viewDir);

    if (unlitColor.x > 0.5 && unlitColor.y > 0.5 && unlitColor.z > 0.5) {
        result = unlitColor - result;
    } else {
        result = unlitColor + result;
    }

    fragColor = vec4(result, 1.0);
}
