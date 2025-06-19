// #include <./AJAX.js>
// #include <./Matrix3D.js>
// #include <./WebGL.js>

'use strict';

myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////////// PanoGL ///
    /** @this {myLib.PanoGL} */
    function PanoGL(...args) {
        this.extends(myLib.WebGL, args);

        // Initialization

        if (this.context !== null) {
            this.setProgram('{PanoGL.Fragment.glsl}', '{PanoGL.Vertex.glsl}');

            this.initAttribs(
                'a_vertex', 4,
                'a_point', 2
            );

            this.initUniform(
                'u_M',
                'u_K',
                'u_perspective',
                'u_sampler_0',
                'u_sampler_1',
                'u_sampler_2',
                'u_sampler_3',
                'u_sampler_4',
                'u_sampler_5',
                'u_sampler_6',
                'u_sampler_7'
            );

            this.uniform1i('u_sampler_0', 0);
            this.uniform1i('u_sampler_1', 1);
            this.uniform1i('u_sampler_2', 2);
            this.uniform1i('u_sampler_3', 3);
            this.uniform1i('u_sampler_4', 4);
            this.uniform1i('u_sampler_5', 5);
            this.uniform1i('u_sampler_6', 6);
            this.uniform1i('u_sampler_7', 7);

            this.uniform1f('u_perspective', 1);
            this.uniformMatrix4fv('u_M', myLib.Matrix3D.identity());

            this.defineProperty('buffer', this.createBuffer());
            this.bufferData(this.buffer, [
                -1.0, -1.0, 0.0, 1.0, -1.0, -1.0,
                1.0, -1.0, 0.0, 1.0, 1.0, -1.0,
                -1.0, 1.0, 0.0, 1.0, -1.0, 1.0,
                1.0, 1.0, 0.0, 1.0, 1.0, 1.0
            ]);

            this.defineProperty('src', ['', '', '']);
            this.defineProperty('src_bak', ['', '', '']);

            this.defineProperty('sources', new Array(8));
            for (let i = 0; i < 8; i++) {
                this.sources[i] = new myLib.Element.HTML.Image();
                this.sources[i].crossOrigin = 'anonymous';
            }

            this.defineProperty('textures', this.createTextures(8));
            this.bindTextures(this.textures);

            let canvas = new myLib.Element.HTML.Canvas();
            canvas.width = 1;
            canvas.height = 1;

            let context = canvas.getContext2D();
            context.fillStyle = '#000000';
            context.fillRect(0, 0, 1, 1);

            for (let i = 0; i < 8; i++)
                this.texImage2D(this.textures[i], canvas);

            this.defineProperty('resolution', 0);
            this.defineProperty('resolution_bak', 0);

            this.hide();
            this.style.transition = 'opacity 1000ms';
        }
    },

    // Static
    {
        className: 'my-pano-gl'
    },

    // Extends
    myLib.WebGL,
    {
        /** @this {myLib.PanoGL.prototype} */
        onResize() {
            myLib.WebGL.prototype.onResize.call(this);

            if (this.width < this.height) {
                let height = this.height / this.width;
                this.bufferData(this.buffer, [
                    -1.0, -1.0, 0.0, 1.0, -1.0, -height,
                    1.0, -1.0, 0.0, 1.0, 1.0, -height,
                    -1.0, 1.0, 0.0, 1.0, -1.0, height,
                    1.0, 1.0, 0.0, 1.0, 1.0, height
                ]);
            } else {
                let width = this.width / this.height;
                this.bufferData(this.buffer, [
                    -1.0, -1.0, 0.0, 1.0, -width, -1.0,
                    1.0, -1.0, 0.0, 1.0, width, -1.0,
                    -1.0, 1.0, 0.0, 1.0, -width, 1.0,
                    1.0, 1.0, 0.0, 1.0, width, 1.0
                ]);
            }

            this.draw(this.buffer);
        }
    },

    // Events
    {
        onLoaded() { },
        onLoading(f) { },
        onReady() { }
    },

    // Methods
    {
        /** @this {myLib.PanoGL.prototype} */
        abort() {
            for (let i = 0; i < 8; i++)
                this.sources[i].clear();

            this.src = this.src_bak;
            this.resolution = this.resolution_bak;

            return this;
        },

        /** @this {myLib.PanoGL.prototype} */
        clear() {
            for (let i = 0; i < 8; i++)
                this.sources[i].clear();

            this.src = ['', '', ''];
            this.src_bak = ['', '', ''];

            this.resolution = 0;
            this.resolution_bak = 0;

            let canvas = new myLib.Element.HTML.Canvas();
            canvas.width = 1;
            canvas.height = 1;

            let context = canvas.getContext2D();
            context.fillStyle = '#000000';
            context.fillRect(0, 0, 1, 1);

            for (let i = 0; i < 8; i++)
                this.texImage2D(this.textures[i], canvas);

            this.draw(this.buffer);
            return this;
        },

        /** @this {myLib.PanoGL.prototype} */
        setPerspective(perspective) {
            this.uniform1f('u_perspective', perspective);
            this.draw(this.buffer);
            return this;
        },

        /** @this {myLib.PanoGL.prototype} */
        setResolution(resolution) {
            if (this.src[0] !== '') {
                for (let i = 0; i < 8; i++)
                    this.sources[i].clear();

                this.resolution = resolution;

                let count = 8;
                myLib.AJAX.get(`${this.src[1]}getFilesPath.php?src=${this.src[2]}/${this.resolution}.nosync/*.jpg`, AJAX => {
                    let files = JSON.parse(AJAX.responseText);
                    for (const file of files) {
                        let i = Number(file.match(/\/([0-7])\.jpg/)[1]);

                        this.sources[i].src = '';
                        this.sources[i].onLoaded = () => {
                            count--;
                            this.onLoading((8 - count) / 8);
                            if (count === 0) {
                                this.resolution_bak = this.resolution;

                                this.uniform2f('u_K', 1 / this.resolution, (this.resolution - 2) / this.resolution);

                                for (let i = 0; i < 8; i++)
                                    this.texImage2D(this.textures[i], this.sources[i]);

                                this.draw(this.buffer);
                                this.onLoaded();
                            }
                        };

                        this.sources[i].src = this.src[1] + file;
                    }
                });
            }

            return this;
        },

        /** @this {myLib.PanoGL.prototype} */
        setSrc(src, resolution) {
            src = src.match(/^(https?:\/\/.*?\/)?(.*)/i).map(match => match || '');

            for (let i = 0; i < 8; i++)
                this.sources[i].clear();

            this.src = src;
            this.resolution = resolution / 4;

            let count = 8;
            myLib.AJAX.get(`${src[1]}getFilesPath.php?src=${src[2]}/${this.resolution}.nosync/*.jpg`, AJAX => {
                let files = JSON.parse(AJAX.responseText);
                for (const file of files) {
                    let i = Number(file.match(/\/([0-7])\.jpg/)[1]);

                    this.sources[i].src = '';
                    this.sources[i].onLoaded = () => {
                        count--;
                        this.onLoading((8 - count) / 136);
                        if (count === 0) {
                            this.src_bak = this.src;
                            this.resolution_bak = this.resolution;

                            this.uniform2f('u_K', 1 / this.resolution, (this.resolution - 2) / this.resolution);

                            for (let i = 0; i < 8; i++)
                                this.texImage2D(this.textures[i], this.sources[i]);

                            this.draw(this.buffer);
                            this.onReady();
                            this.show();

                            this.resolution = resolution;

                            count = 8;
                            myLib.AJAX.get(`${src[1]}getFilesPath.php?src=${src[2]}/${this.resolution}.nosync/*.jpg`, AJAX => {
                                let files = JSON.parse(AJAX.responseText);
                                for (const file of files) {
                                    let i = Number(file.match(/\/([0-7])\.jpg/)[1]);

                                    this.sources[i].onLoaded = () => {
                                        count--;
                                        this.onLoading((1 + 2 * (8 - count)) / 17);
                                        if (count === 0) {
                                            this.resolution_bak = this.resolution;

                                            this.uniform2f('u_K', 1 / this.resolution, (this.resolution - 2) / this.resolution);

                                            for (let i = 0; i < 8; i++)
                                                this.texImage2D(this.textures[i], this.sources[i]);

                                            this.draw(this.buffer);
                                            this.onLoaded();
                                        }
                                    };

                                    this.sources[i].src = src[1] + file;
                                }
                            });
                        }
                    };

                    this.sources[i].src = src[1] + file;
                }
            });

            return this;
        },

        /** @this {myLib.PanoGL.prototype} */
        setView(M) {
            this.uniformMatrix4fv('u_M', M);
            this.draw(this.buffer);
            return this;
        },

        /** @this {myLib.PanoGL.prototype} */
        update() {
            this.draw(this.buffer);
            return this;
        }
    }
);