#version 300 es

in vec2 aPos;

in vec2 aStart;
in vec2 aMiddle;
in vec2 aEnd;

out vec4 vColour;

uniform sampler2D uColourTexture; // texture from the original video node

void main() {
    vec2 pos;
    if (aPos.x == 0.0) {
        pos = aStart;
    } else if (aPos.x == 0.5) {
        pos = aMiddle;
    } else {
        pos = aEnd;
    }
    gl_Position = vec4(pos * 2.0 - 1.0, 0, 1);

    vColour = texture(uColourTexture, pos);
}
