#version 300 es

in vec2 aPos;

in vec2 aStart;
in vec2 aMiddle;
in vec2 aEnd;

out vec4 vColour;

void main() {
    vec2 pos;
    if (aPos.x == 0.0) {
        pos = aStart;
        vColour = vec4(1, 0, 0, 1);
    } else if (aPos.x == 0.5) {
        pos = aMiddle;
        vColour = vec4(0, 1, 0, 1);
    } else if (aPos.x == 1.0){
        pos = aEnd;
        vColour = vec4(0, 0, 1, 1);
    } else {
        pos = aEnd;
        vColour = vec4(0);
    }
    gl_Position = vec4(pos * 2.0 - 1.0, 0, 1);
}
