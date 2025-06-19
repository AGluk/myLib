declare namespace myLib {
    abstract class Matrix3D extends myLib { /////////////////////////////////////////////////////////////////////////////// Matrix3D ///
        static cross(V1: vector3D, V2: vector3D): vector3D;
        static determinant(M: matrix3D): number;
        static inverse(M: matrix3D): matrix3D;
        static length(V: vector3D): number;
        static normalize(V: vector3D): boolean;
        static identity(): matrix3D;
        static rotateX(angle: number): matrix3D;
        static rotateY(angle: number): matrix3D;
        static rotateZ(angle: number): matrix3D;
        static translate(dx: number, dy: number, dz: number): matrix3D;
        static MxM(...M: matrix3D[]): matrix3D;
        static MxV(M: matrix3D, V: vector3D): vector3D;
        static VxM(V: vector3D, M: matrix3D): vector3D;
    }

    type matrix3D = number[] & { length: 16 };
    type vector3D = number[] & { length: 4 };
}