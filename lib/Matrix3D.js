// #include <./myLib.js>

'use strict';

myLib.defineClass('Matrix3D', { ////////////////////////////////////////////////////////////////////////////////////////////// Matrix3D ///
    cross(V1, V2) {
        return [
            V1[1] * V2[2] - V1[2] * V2[1],
            V1[2] * V2[0] - V1[0] * V2[2],
            V1[0] * V2[1] - V1[1] * V2[0],
            1
        ];
    },

    determinant(M) {
        return M[0] * (M[5] * M[10] - M[6] * M[9]) + M[1] * (M[6] * M[8] - M[4] * M[10]) + M[2] * (M[4] * M[9] - M[5] * M[8]);
    },

    inverse(M) {
        let determinant = M[0] * (M[5] * M[10] - M[6] * M[9]) + M[1] * (M[6] * M[8] - M[4] * M[10]) + M[2] * (M[4] * M[9] - M[5] * M[8]);
        return [
            (M[5] * M[10] - M[6] * M[9]) / determinant, (M[2] * M[9] - M[1] * M[10]) / determinant, (M[1] * M[6] - M[2] * M[5]) / determinant, 0,
            (M[6] * M[8] - M[4] * M[10]) / determinant, (M[0] * M[10] - M[2] * M[8]) / determinant, (M[2] * M[4] - M[0] * M[6]) / determinant, 0,
            (M[4] * M[9] - M[5] * M[8]) / determinant, (M[1] * M[8] - M[0] * M[9]) / determinant, (M[0] * M[5] - M[1] * M[4]) / determinant, 0,
            (M[4] * M[10] * M[13] - M[5] * M[10] * M[12] + M[5] * M[8] * M[14] - M[6] * M[8] * M[13] - M[4] * M[9] * M[14] + M[6] * M[9] * M[12]) / determinant, (M[1] * M[10] * M[12] - M[0] * M[10] * M[13] - M[1] * M[8] * M[14] + M[2] * M[8] * M[13] + M[0] * M[9] * M[14] - M[2] * M[9] * M[12]) / determinant, (M[1] * M[4] * M[14] - M[2] * M[4] * M[13] - M[0] * M[5] * M[14] + M[2] * M[5] * M[12] - M[1] * M[6] * M[12] + M[0] * M[6] * M[13]) / determinant, 1
        ];
    },

    length(V) {
        return Math.sqrt(V[0] * V[0] + V[1] * V[1] + V[2] * V[2]);
    },

    normalize(V) {
        let norm = Math.sqrt(V[0] * V[0] + V[1] * V[1] + V[2] * V[2]);
        if (norm > 0) {
            V[0] /= norm;
            V[1] /= norm;
            V[2] /= norm;

            return true;
        } else {
            return false;
        }
    },

    identity() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    rotateX(angle) {
        let sin = Math.sin(angle),
            cos = Math.cos(angle);

        return [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ];
    },

    rotateY(angle) {
        let sin = Math.sin(angle),
            cos = Math.cos(angle);

        return [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ];
    },

    rotateZ(angle) {
        let sin = Math.sin(angle),
            cos = Math.cos(angle);

        return [
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    translate(dx, dy, dz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            dx, dy, dz, 1
        ];
    },

    MxM(M1, M2, ...Mrest) {
        let M = [
            M1[0] * M2[0] + M1[1] * M2[4] + M1[2] * M2[8], M1[0] * M2[1] + M1[1] * M2[5] + M1[2] * M2[9], M1[0] * M2[2] + M1[1] * M2[6] + M1[2] * M2[10], 0,
            M1[4] * M2[0] + M1[5] * M2[4] + M1[6] * M2[8], M1[4] * M2[1] + M1[5] * M2[5] + M1[6] * M2[9], M1[4] * M2[2] + M1[5] * M2[6] + M1[6] * M2[10], 0,
            M1[8] * M2[0] + M1[9] * M2[4] + M1[10] * M2[8], M1[8] * M2[1] + M1[9] * M2[5] + M1[10] * M2[9], M1[8] * M2[2] + M1[9] * M2[6] + M1[10] * M2[10], 0,
            M1[12] * M2[0] + M1[13] * M2[4] + M1[14] * M2[8] + M2[12], M1[12] * M2[1] + M1[13] * M2[5] + M1[14] * M2[9] + M2[13], M1[12] * M2[2] + M1[13] * M2[6] + M1[14] * M2[10] + M2[14], 1
        ];

        for (const Mn of Mrest) {
            M = [
                M[0] * Mn[0] + M[1] * Mn[4] + M[2] * Mn[8], M[0] * Mn[1] + M[1] * Mn[5] + M[2] * Mn[9], M[0] * Mn[2] + M[1] * Mn[6] + M[2] * Mn[10], 0,
                M[4] * Mn[0] + M[5] * Mn[4] + M[6] * Mn[8], M[4] * Mn[1] + M[5] * Mn[5] + M[6] * Mn[9], M[4] * Mn[2] + M[5] * Mn[6] + M[6] * Mn[10], 0,
                M[8] * Mn[0] + M[9] * Mn[4] + M[10] * Mn[8], M[8] * Mn[1] + M[9] * Mn[5] + M[10] * Mn[9], M[8] * Mn[2] + M[9] * Mn[6] + M[10] * Mn[10], 0,
                M[12] * Mn[0] + M[13] * Mn[4] + M[14] * Mn[8] + Mn[12], M[12] * Mn[1] + M[13] * Mn[5] + M[14] * Mn[9] + Mn[13], M[12] * Mn[2] + M[13] * Mn[6] + M[14] * Mn[10] + Mn[14], 1
            ]
        }

        return M;
    },

    MxV(M, V) {
        return [
            M[0] * V[0] + M[1] * V[1] + M[2] * V[2], M[4] * V[0] + M[5] * V[1] + M[6] * V[2], M[8] * V[0] + M[9] * V[1] + M[10] * V[2], M[12] * V[0] + M[13] * V[1] + M[14] * V[2] + 1
        ];
    },

    VxM(V, M) {
        return [
            V[0] * M[0] + V[1] * M[4] + V[2] * M[8] + M[12], V[0] * M[1] + V[1] * M[5] + V[2] * M[9] + M[13], V[0] * M[2] + V[1] * M[6] + V[2] * M[10] + M[14], 1
        ];
    }
});