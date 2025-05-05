// #include <./Element.js>

'use strict';

myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////////// WebGL ///
    /** @this {myLib.WebGL} */
    function WebGL(...args) {
        myLib.Element.HTML.Canvas.apply(this, args);

        // Initialization

        if (args[0] instanceof HTMLCanvasElement) {
            this.defineProperty('context', this.getContext3D(args[3]));
        } else {
            this.defineProperty('context', this.getContext3D(args[2]));
        }

        if (this.context !== null)
            this.context.s3tc = this.context.getExtension('WEBGL_compressed_texture_s3tc');

        this.defineProperty('program', null);
        this.defineProperty('attribs', {});
        this.defineProperty('uniform', {});
        this.defineProperty('stride', 0);
    },

    // Extends
    myLib.Element.HTML.Canvas,
    {
        className: {
            /** @this {myLib.WebGL.prototype} */
            get() {
                return this.target.className.match(/(^| )(webgl\s+(.+))?$/)[3] || '';
            },

            /** @this {myLib.WebGL.prototype} */
            set(className) {
                myLib.Element.HTML.Canvas.proto('className').set(this, `webgl ${className.trimStart()}`);
            }
        },

        /** @this {myLib.WebGL.prototype} */
        onResize() {
            if ((typeof window.devicePixelRatio === 'number') && (window.devicePixelRatio > 2)) {
                this.target.width = window.devicePixelRatio * this.clientWidth;
                this.target.height = window.devicePixelRatio * this.clientHeight;
            } else {
                this.target.width = 2 * this.clientWidth;
                this.target.height = 2 * this.clientHeight;
            }

            this.context.viewport(0, 0, this.target.width, this.target.height);
        }
    },

    // Methods
    {
        /** @this {myLib.WebGL.prototype} */
        bindTextures(textures) {
            for (const texture of textures) {
                this.context.activeTexture(texture.index);
                this.context.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture.target);
            }
        },

        /** @this {myLib.WebGL.prototype} */
        bufferData(buffer, data, usage = WebGLRenderingContext.STATIC_DRAW) {
            this.context.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer);
            this.context.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array(data), usage);

            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        createBuffer() {
            return this.context.createBuffer();
        },

        /** @this {myLib.WebGL.prototype} */
        createTextures(count) {
            let textures = new Array(count);

            if (count < 1) return textures;
            textures[0] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE0);

            if (count < 2) return textures;
            textures[1] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE1);

            if (count < 3) return textures;
            textures[2] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE2);

            if (count < 4) return textures;
            textures[3] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE3);

            if (count < 5) return textures;
            textures[4] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE4);

            if (count < 6) return textures;
            textures[5] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE5);

            if (count < 7) return textures;
            textures[6] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE6);

            if (count < 8) return textures;
            textures[7] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE7);

            if (count < 9) return textures;
            textures[8] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE8);

            if (count < 10) return textures;
            textures[9] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE9);

            if (count < 11) return textures;
            textures[10] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE10);

            if (count < 12) return textures;
            textures[11] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE11);

            if (count < 13) return textures;
            textures[12] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE12);

            if (count < 14) return textures;
            textures[13] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE13);

            if (count < 15) return textures;
            textures[14] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE14);

            if (count < 16) return textures;
            textures[15] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE15);

            if (count < 17) return textures;
            textures[16] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE16);

            if (count < 18) return textures;
            textures[17] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE17);

            if (count < 19) return textures;
            textures[18] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE18);

            if (count < 20) return textures;
            textures[19] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE19);

            if (count < 21) return textures;
            textures[20] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE20);

            if (count < 22) return textures;
            textures[21] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE21);

            if (count < 23) return textures;
            textures[22] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE22);

            if (count < 24) return textures;
            textures[23] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE23);

            if (count < 25) return textures;
            textures[24] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE24);

            if (count < 26) return textures;
            textures[25] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE25);

            if (count < 27) return textures;
            textures[26] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE26);

            if (count < 28) return textures;
            textures[27] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE27);

            if (count < 29) return textures;
            textures[28] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE28);

            if (count < 30) return textures;
            textures[29] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE29);

            if (count < 31) return textures;
            textures[30] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE30);

            if (count < 32) return textures;
            textures[31] = new myLib.WebGL.Texture(this.context.createTexture(), WebGLRenderingContext.TEXTURE31);

            return textures;
        },

        /** @this {myLib.WebGL.prototype} */
        draw(buffer, mode = WebGLRenderingContext.TRIANGLE_STRIP) {
            this.context.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer);

            for (let key in this.attribs)
                this.context.vertexAttribPointer(this.attribs[key].location, this.attribs[key].size,
                    WebGLRenderingContext.FLOAT, false, this.stride, this.attribs[key].offset);

            this.context.drawArrays(mode, 0,
                this.context.getBufferParameter(WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.BUFFER_SIZE) / this.stride);

            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        getShader(type, src) {
            let shader = this.context.createShader(type);

            this.context.shaderSource(shader, src);
            this.context.compileShader(shader);

            if (!this.context.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS))
                alert(this.context.getShaderInfoLog(shader));

            return shader;
        },

        /** @this {myLib.WebGL.prototype} */
        initAttribs(...args) {
            for (let i = 0; i < args.length; i += 2) {
                let location = this.context.getAttribLocation(this.program, args[i]);
                this.context.enableVertexAttribArray(location);

                this.attribs[args[i]] = {
                    location: location,
                    offset: this.stride,
                    size: args[i + 1]
                };

                this.stride += 4 * args[i + 1];
            }

            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        initUniform(...args) {
            for (const name of args)
                this.uniform[name] = this.context.getUniformLocation(this.program, name);

            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        setProgram(fragmentShader, vertexShader) {
            this.program = this.context.createProgram();
            this.attribs = {};
            this.uniform = {};
            this.stride = 0;

            this.context.attachShader(this.program, this.getShader(WebGLRenderingContext.FRAGMENT_SHADER, fragmentShader));
            this.context.attachShader(this.program, this.getShader(WebGLRenderingContext.VERTEX_SHADER, vertexShader));
            this.context.linkProgram(this.program);

            if (!this.context.getProgramParameter(this.program, WebGLRenderingContext.LINK_STATUS)) {
                alert(this.context.getProgramInfoLog(this.program));
            } else {
                this.context.useProgram(this.program);
            }

            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        texImage2D(texture, source) {
            this.context.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture.target);

            this.context.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0,
                WebGLRenderingContext.RGB, WebGLRenderingContext.RGB, WebGLRenderingContext.UNSIGNED_BYTE, source.target);

            this.context.texParameteri(WebGLRenderingContext.TEXTURE_2D,
                WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.LINEAR);

            this.context.texParameteri(WebGLRenderingContext.TEXTURE_2D,
                WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR);

            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform1f(name, x) {
            this.context.uniform1f(this.uniform[name], x);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform1fv(name, vector) {
            this.context.uniform1fv(this.uniform[name], vector);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform2f(name, x, y) {
            this.context.uniform2f(this.uniform[name], x, y);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform2fv(name, vector) {
            this.context.uniform2fv(this.uniform[name], vector);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform3f(name, x, y, z) {
            this.context.uniform3f(this.uniform[name], x, y, z);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform3fv(name, vector) {
            this.context.uniform3fv(this.uniform[name], vector);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform4f(name, x, y, z, w) {
            this.context.uniform4f(this.uniform[name], x, y, z, w);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform4fv(name, vector) {
            this.context.uniform4fv(this.uniform[name], vector);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform1i(name, x) {
            this.context.uniform1i(this.uniform[name], x);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform1iv(name, vector) {
            this.context.uniform1iv(this.uniform[name], vector);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform2i(name, x, y) {
            this.context.uniform2i(this.uniform[name], x, y);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform2iv(name, vector) {
            this.context.uniform2iv(this.uniform[name], vector);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform3i(name, x, y, z) {
            this.context.uniform3i(this.uniform[name], x, y, z);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform3iv(name, vector) {
            this.context.uniform3iv(this.uniform[name], vector);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform4i(name, x, y, z, w) {
            this.context.uniform4i(this.uniform[name], x, y, z, w);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniform4iv(name, vector) {
            this.context.uniform4iv(this.uniform[name], vector);
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniformMatrix2fv(name, matrix, transpose = false) {
            this.context.uniformMatrix2fv(this.uniform[name], transpose, new Float32Array(matrix));
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniformMatrix3fv(name, matrix, transpose = false) {
            this.context.uniformMatrix3fv(this.uniform[name], transpose, new Float32Array(matrix));
            return this;
        },

        /** @this {myLib.WebGL.prototype} */
        uniformMatrix4fv(name, matrix, transpose = false) {
            this.context.uniformMatrix4fv(this.uniform[name], transpose || false, new Float32Array(matrix));
            return this;
        }
    }
);

myLib.WebGL.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////// Texture ///
    /** @this {myLib.WebGL.Texture} */
    function Texture(texture, index) {
        this.defineProperty('target', texture);
        this.defineProperty('index', index);
    },

    // Extends
    myLib
);