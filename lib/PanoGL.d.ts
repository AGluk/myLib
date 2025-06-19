declare namespace myLib {
    class PanoGL extends WebGL { ////////////////////////////////////////////////////////////////////////////////////////////// Pano ///
        constructor(target?: HTMLCanvasElement, className?: string, id?: string);
        constructor(className?: string, id?: string);

        // Properties
        buffer: WebGLBuffer | null;
        src: string[];
        src_bak: string[];
        sources: Element.HTML.Image[];
        textures: WebGL.Texture[];
        resolution: number;
        resolution_bak: number;

        // Events
        onLoaded(): void;
        onLoading(f: number): void;
        onReady(): void;

        // Methods
        abort(): this;
        clear(): this;
        setPerspective(perspective: GLfloat): this;
        setResolution(resolution: number): this;
        setSrc(src: string, resolution: number): this;
        setView(M: matrix3D): this;
        update(): this;
    } interface PanoGL {
        constructor: typeof PanoGL;
    }
}