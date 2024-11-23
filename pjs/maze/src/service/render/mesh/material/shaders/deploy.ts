export const vert = `#version 300 es
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
  vec3 normalFBL, normalFBR, normalFTL, normalFTR;
  vec3 normalBBL, normalBBR, normalBTL, normalBTR;
};

vec3 trilinearInterpolateNormal(vec3 point) {
  float x = point.x;
  float y = point.y;
  float z = point.z;

  // Step 1: Interpolate along the X-axis for each corner pair
  vec3 NFrontBottom = mix(normalFBL, normalFBR, x);// Front-bottom normals
  vec3 NBackBottom = mix(normalBBL, normalBBR, x);// Back-bottom normals
  vec3 NFrontTop = mix(normalFTL, normalFTR, x);// Front-top normals
  vec3 NBackTop = mix(normalBTL, normalBTR, x);// Back-top normals

  // Step 2: Interpolate along the Z-axis (depth) for bottom and top planes
  vec3 NBottom = mix(NBackBottom, NFrontBottom, z);
  vec3 NTop = mix(NBackTop, NFrontTop, z);

  // Step 3: Final interpolation along the Y-axis
  vec3 interpolatedNormal = mix(NBottom, NTop, y);

  return normalize(interpolatedNormal);
}

void main() {

  vec3 normalizedPosition = (aPosition + vec3(1.0)) * 0.5;

  vec3 interpolatedNormal = trilinearInterpolateNormal(normalizedPosition);
  vNormal = mix(aNormal, interpolatedNormal, 0.2); // adjust the mix ratio

  vec3 transformedPosition =
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (normalizedPosition.z) * FBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (normalizedPosition.z) * FBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (normalizedPosition.z) * FTL +
    normalizedPosition.x * normalizedPosition.y * (normalizedPosition.z) * FTR +
    (1.0 - normalizedPosition.x) * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * BBL +
    normalizedPosition.x * (1.0 - normalizedPosition.y) * (1.0 - normalizedPosition.z) * BBR +
    (1.0 - normalizedPosition.x) * normalizedPosition.y * (1.0-normalizedPosition.z) * BTL +
    normalizedPosition.x * normalizedPosition.y * (1.0 - normalizedPosition.z) * BTR;

  fragPos = vec3(model * vec4(transformedPosition, 1.0));
  gl_Position = projection * view * vec4(fragPos, 1.0);
}
`
export const frag = `#version 300 es
precision mediump float;

out vec4 fragColor;

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
    vec4 specular; // vec4 to make sure the last 4 bytes pad

    float cutOff;
    float outerCutOff;

    float constant;
    float linear;
    float quadratic;
};

layout (std140) uniform Lights
{
    PointLight pointLights[2];
    SpotLight spotLight;
    vec3 viewPos;
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
//    fragColor =vec4(vNormal, 1.0);
//    fragColor =vec4((vNormal + 1.0) / 2.0, 1.0);
//    return;

    vec3 norm = normalize(vNormal);

    vec3 viewDir = normalize(viewPos - fragPos);

    vec3 result = vec3(0.0);
    result += CalcPointLight(pointLights[0], norm, fragPos, viewDir);
    result += CalcPointLight(pointLights[1], norm, fragPos, viewDir);
    result += CalcSpotLight(spotLight, norm, fragPos, viewDir);

    fragColor = vec4(result, 1.0);
}

`
