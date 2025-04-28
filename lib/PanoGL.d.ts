declare namespace myLib {
    class PanoGL extends WebGL { ////////////////////////////////////////////////////////////////////////////////////////////// Pano ///
        constructor(target?: HTMLCanvasElement, parent?: Element, className?: string, id?: string);
        constructor(className?: string, id?: string);

        // Properties
        buffer: WebGLBuffer | null;
        src: string;
        src_bak: string;
        sources: Element.HTML.Image[];
        textures: WebGL.Texture[];
        resolution: number;
        resolution_bak: number;

        // Accessors
        get className(): string;
        set className(value: string);

        // Events
        onLoaded(): void;
        onLoading(f: number): void;

        // Listeners
        onResize(capture?: boolean): boolean | void;

        // Methods
        abort(): this;
        clear(): this;
        setPerspective(perspective: GLfloat): this;
        setSrc(src: string, resolution: number): this;
        setView(M: number[]): this;
        update(): this;
    } interface PanoGL {
        constructor: PanoGL;
    }
}