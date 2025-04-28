// #include <./AJAX.js>
// #include <./Matrix3D.js>
// #include <./WebGL.js>

'use strict';

myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////////// PanoGL ///
    /** @this {myLib.PanoGL} */
    function PanoGL(...args) {
        myLib.WebGL.apply(this, args);

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

            this.defineProperty('src', '');
            this.defineProperty('src_bak', '');

            this.defineProperty('sources', new Array(8));
            for (let i = 0; i < 8; i++)
                this.sources[i] = new myLib.Element.HTML.Image();

            this.defineProperty('textures', this.createTextures(8));
            this.bindTextures(this.textures);

            let canvas = new myLib.Element.HTML.Canvas();
            canvas.width = 1;
            canvas.height = 1;

            let context = canvas.getContext2D();
            context.fillStyle = "#000000";
            context.fillRect(0, 0, 1, 1);

            for (let i = 0; i < 8; i++)
                this.texImage2D(this.textures[i], canvas);

            this.defineProperty('resolution', 0);
            this.defineProperty('resolution_bak', 0);

            this.hide();
            this.style.transition = "opacity 1000ms";
        }
    },

    // Extends
    myLib.WebGL,
    {
        className: {
            /** @this {myLib.PanoGL.prototype} */
            get() {
                return this.target.className.match(/(^| )pano( (.+))?$/)[3] || '';
            },

            /** @this {myLib.PanoGL.prototype} */
            set(className) {
                myLib.WebGL.proto('className').set(this, `pano ${className.trimStart()}`);
            }
        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        onLoading(f) { }
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

            this.src = '';
            this.src_bak = '';

            this.resolution = 0;
            this.resolution_bak = 0;

            let canvas = new myLib.Element.HTML.Canvas();
            canvas.width = 1;
            canvas.height = 1;

            let context = canvas.getContext2D();
            context.fillStyle = "#000000";
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
        setSrc(src, resolution) {
            this.src = src;
            this.resolution = resolution;

            let count = 8;
            myLib.AJAX.get(`getFilesPath.php?src=${src}/${resolution / 4}.nosync/*.jpg`, AJAX => {
                let files = JSON.parse(AJAX.responseText);
                for (const file of files) {
                    let i = parseInt(file.match(/\/([0-7])\.jpg/)[1], 10);

                    this.sources[i].src = '';
                    this.sources[i].onLoaded = () => {
                        count--;
                        this.onLoading((8 - count) / 8);
                        if (count === 0) {
                            this.src_bak = this.src;
                            this.resolution_bak = this.resolution;

                            this.uniform2f('u_K', 4 / this.resolution, (this.resolution - 8) / this.resolution);

                            for (let i = 0; i < 8; i++)
                                this.texImage2D(this.textures[i], this.sources[i]);

                            this.onLoaded();
                            this.draw(this.buffer);
                            this.show();

                            count = 8;
                            myLib.AJAX.get(`getFilesPath.php?src=${src}/${resolution}.nosync/*.jpg`, AJAX => {
                                let files = JSON.parse(AJAX.responseText);
                                for (const file of files) {
                                    let i = parseInt(file.match(/\/([0-7])\.jpg/)[1], 10);

                                    this.sources[i].onLoaded = () => {
                                        count--;
                                        this.onLoading(1 + (8 - count) / 8);
                                        if (count === 0) {
                                            this.uniform2f('u_K', 1 / this.resolution, (this.resolution - 2) / this.resolution);

                                            for (let i = 0; i < 8; i++)
                                                this.texImage2D(this.textures[i], this.sources[i]);

                                            this.draw(this.buffer);
                                        }
                                    };

                                    this.sources[i].src = file;
                                }
                            });
                        }
                    };

                    this.sources[i].src = file;
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