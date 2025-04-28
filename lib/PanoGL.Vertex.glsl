attribute vec4 a_vertex;
attribute vec2 a_point;

varying vec2 v_point;

void main() {
    gl_Position = a_vertex;
    v_point = a_point;
}