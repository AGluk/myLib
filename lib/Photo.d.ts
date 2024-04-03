declare namespace myLib {
    class Photo extends Layer { ////////////////////////////////////////////////////////////////////////////////////////////// Photo ///
        constructor(id?: string, className?: string);
        constructor(className?: string);

        // Children
        load: Photo.Load;
        body: Photo.Body;
        close: Photo.Close;

        // Properties
        AJAX: XMLHttpRequest;

        images: {
            path: string
            date: number
            width: number
            height: number
            thumbnail: string
        }[];

        // Listeners
        onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
        onTap(target?: HTMLElement): boolean | void;

        // Methods
        setImages(images: {
            path: string
            date: number
            width: number
            heigth: number
            thumbnail: string
        }[]): this;

        setSrc(src: string): this;
    } interface Photo {
        constructor: Photo;
    }

    namespace Photo {
        class Body extends Scroll { /////////////////////////////////////////////////////////////////////////////////////// Body ///
            constructor();
            parent: Photo;

            // Children
            frame: Body.Frame[];

            // Properties
            index: number;

            // Listeners
            onResize(capture?: boolean): boolean | void;
            onScroll(scrollLeft?: number, scrollTop?: number, zoom?: number): void;
            onTap(target?: HTMLElement): boolean | void;
            onTouchEnd(): boolean | void;

            // Methods
            clear(): this;
        } interface Body {
            constructor: Body;
        }

        namespace Body {
            class Frame extends Scroll { ///////////////////////////////////////////////////////////////////////////// Frame ///
                constructor();
                parent: Body;

                // Children
                gizmo: Frame.Gizmo;

                // Properties
                index: number;
                image: {
                    path: string
                    date: number
                    width: number
                    height: number
                    thumbnail: string
                };

                // Listeners
                onResize(capture?: boolean): boolean | void;
                onTap(target?: HTMLElement): boolean | void;

                // Methods
                clear(): this;
                setIndex(index: number): this;
            } interface Frame {
                constructor: Frame;
            }

            namespace Frame {
                class Gizmo extends Element.HTML.Div { /////////////////////////////////////////////////////////// Gizmo ///
                    constructor();
                    parent: Frame;

                    // Children
                    image: Element.HTML.Image;

                    // Listeners
                    onResize(capture?: boolean): boolean | void;

                    // Methods
                    clear(): this;
                    setImage(image: {
                        path: string
                        date: number
                        thumbnail: string
                    }): this;
                } interface Gizmo {
                    constructor: Gizmo;
                }

                namespace Gizmo {
                    class Image extends Element.HTML.Image { ///////////////////////////////////////////////// Image ///
                        constructor();
                        parent: Gizmo;
                    } interface Image {
                        constructor: Image;
                    }
                }
            }
        }

        class Close extends Element.HTML.Image, Touch { ////////////////////////////////////////////////////////////////// Close ///
            constructor();
            parent: Photo;

            // Listeners
            onTap(target: HTMLElement): boolean;
        } interface Close {
            constructor: Close;
        }

        class Load extends Element.HTML.Image { /////////////////////////////////////////////////////////////////////////// Load ///
            constructor();
            parent: Photo;
        } interface Load {
            constructor: Load;
        }
    }
}