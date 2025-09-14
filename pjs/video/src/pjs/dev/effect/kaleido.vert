#version 300 es

in vec2 aPos;
in vec2 aUV;

in float aStartAngle;
in float aSign;

uniform float uAnglePerTriangle;

out vec2 vUV;

void main() {
    vUV = aUV;

    if (aPos.x == 0.0 && aPos.y == 0.0) {
        gl_Position = vec4(aPos, 0, 1);
        return;
    }

    bool flip = aSign != 1.0;

    float start = radians(aStartAngle);

    if (aPos.x == 1.0 && aPos.y == 1.0) {
        float x = cos(start) * 2.0;
        float y = sin(start) * 2.0;
        gl_Position = vec4(x, y, 0, 1);
        return;
    }

    float end = start + radians(uAnglePerTriangle);

    float x = cos(end) * 2.0;
    float y = sin(end) * 2.0;
    gl_Position = vec4(x, y, 0, 1);
}
