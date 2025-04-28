declare namespace myLib {
    abstract class Matrix3D extends myLib { /////////////////////////////////////////////////////////////////////////////// Matrix3D ///
        static cross(V1: number[], V2: number[]): number[];
        static determinant(M: number[]): number;
        static inverse(M: number[]): number[];
        static length(V: number[]): number;
        static normalize(V: number[]): boolean;
        static identity(): number[];
        static rotateX(angle: number): number[];
        static rotateY(angle: number): number[];
        static rotateZ(angle: number): number[];
        static translate(dx: number, dy: number, dz: number): number[];
        static MxM(...M: number[][]): number[];
        static MxV(M: number[], V: number[]): number[];
        static VxM(V: number[], M: number[]): number[];
    }
}