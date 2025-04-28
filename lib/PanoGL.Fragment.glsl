precision highp float;

uniform mat4 u_M;
uniform vec2 u_K;
uniform float u_perspective;

uniform sampler2D u_sampler_0;
uniform sampler2D u_sampler_1;
uniform sampler2D u_sampler_2;
uniform sampler2D u_sampler_3;
uniform sampler2D u_sampler_4;
uniform sampler2D u_sampler_5;
uniform sampler2D u_sampler_6;
uniform sampler2D u_sampler_7;

varying vec2 v_point;

float atan2(float y, float x) {
    if (x > 0.0) {
        return atan(y / x);
    } else if (x < 0.0) {
        if (y < 0.0) {
            return atan(y / x) - 3.1415927;
        } else {
            return atan(y / x) + 3.1415927;
        }
    } else {
        if (y < 0.0) {
            return -1.5707963;
        } else if (y > 0.0) {
            return 1.5707963;
        } else {
            return 0.0;
        }
    }
}

void main() {
    vec4 point = vec4(v_point.x, v_point.y, -u_perspective, 1.0) * u_M;
    vec2 coord = vec2(2.0 + atan2(point.x, -point.z) / 1.5707963, 1.0 + atan2(point.y, sqrt(point.x * point.x + point.z * point.z)) / 1.5707963);

    if (coord.y < 1.0) {
        if (coord.x < 1.0) {
            gl_FragColor = texture2D(u_sampler_0, u_K[0] + u_K[1] * coord);
        } else if (coord.x < 2.0) {
            gl_FragColor = texture2D(u_sampler_1, u_K[0] + u_K[1] * (coord - vec2(1.0, 0.0)));
        } else if (coord.x < 3.0) {
            gl_FragColor = texture2D(u_sampler_2, u_K[0] + u_K[1] * (coord - vec2(2.0, 0.0)));
        } else {
            gl_FragColor = texture2D(u_sampler_3, u_K[0] + u_K[1] * (coord - vec2(3.0, 0.0)));
        }
    } else {
        if (coord.x < 1.0) {
            gl_FragColor = texture2D(u_sampler_4, u_K[0] + u_K[1] * (coord - vec2(0.0, 1.0)));
        } else if (coord.x < 2.0) {
            gl_FragColor = texture2D(u_sampler_5, u_K[0] + u_K[1] * (coord - vec2(1.0, 1.0)));
        } else if (coord.x < 3.0) {
            gl_FragColor = texture2D(u_sampler_6, u_K[0] + u_K[1] * (coord - vec2(2.0, 1.0)));
        } else {
            gl_FragColor = texture2D(u_sampler_7, u_K[0] + u_K[1] * (coord - vec2(3.0, 1.0)));
        }
    }
}