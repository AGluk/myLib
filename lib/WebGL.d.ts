interface WebGLRenderingContext {
    s3tc: WEBGL_compressed_texture_s3tc | null;
}

declare namespace myLib {
    class WebGL extends Element.HTML.Canvas { //////////////////////////////////////////////////////////////////////////////// WebGL ///
        constructor(target?: HTMLCanvasElement, className?: string, id?: string, contextAttributes?: WebGLContextAttributes);
        constructor(className?: string, id?: string, contextAttributes?: WebGLContextAttributes);

        // Properties
        context: WebGLRenderingContext | null;

        program: WebGLProgram | null;
        attribs: Record<string, { location: GLint, offset: GLintptr, size: GLint }>;
        uniform: Record<string, WebGLUniformLocation | null>;
        stride: GLsizei;

        // Methods
        bindTexture(...textures: WebGL.Texture[]): this;
        bindTextures(textures: WebGL.Texture[]): this;
        bufferData(buffer: WebGLBuffer, data: number[], usage?: GLenum): this;
        createBuffer(): WebGLBuffer | null;
        createTextures(count: number): (WebGL.Texture | null)[];
        draw(buffer: WebGLBuffer, mode?: GLenum): this;
        getShader(type: GLenum, src: string): WebGLShader | null;
        initAttribs(...name_size: (string | GLint)[]): this;
        initUniform(...name: string[]): this;
        setProgram(fragmentShader: string, vertexShader: string): this;
        texImage2D(texture: WebGL.Texture, source: Element.HTML.Canvas | Element.HTML.Image): this;

        uniform1f(name: string, x: GLfloat): this;
        uniform1fv(name: string, vector: Float32List): this;
        uniform2f(name: string, x: GLfloat, y: GLfloat): this;
        uniform2fv(name: string, vector: Float32List): this;
        uniform3f(name: string, x: GLfloat, y: GLfloat, z: GLfloat): this;
        uniform3fv(name: string, vector: Float32List): this;
        uniform4f(name: string, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): this;
        uniform4fv(name: string, vector: Float32List): this;

        uniform1i(name: string, x: GLint): this;
        uniform1iv(name: string, vector: Int32List): this;
        uniform2i(name: string, x: GLint, y: GLint): this;
        uniform2iv(name: string, vector: Int32List): this;
        uniform3i(name: string, x: GLint, y: GLint, z: GLint): this;
        uniform3iv(name: string, vector: Int32List): this;
        uniform4i(name: string, x: GLint, y: GLint, z: GLint, w: GLint): this;
        uniform4iv(name: string, vector: Int32List): this;

        uniformMatrix2fv(name: string, matrix: number[], transpose = false): this;
        uniformMatrix3fv(name: string, matrix: number[], transpose = false): this;
        uniformMatrix4fv(name: string, matrix: number[], transpose = false): this;
    } interface WebGL {
        constructor: typeof WebGL;
    }

    namespace WebGL {
        class Texture extends myLib { ////////////////////////////////////////////////////////////////////////////////// Texture ///
            constructor(texture: WebGLTexture, index: GLenum);

            // Properties
            target: WebGLTexture;
            index: GLenum;
        } interface Texture {
            constructor: typeof Texture;
        }
    }
}