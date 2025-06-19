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

        // Methods
        clear(): this;

        setImages(images: {
            path: string
            date: number
            width: number
            heigth: number
            thumbnail: string
        }[]): this;

        setSrc(src: string): this;
    } interface Photo {
        constructor: typeof Photo;
    }

    namespace Photo {
        class Body extends Scroll { /////////////////////////////////////////////////////////////////////////////////////// Body ///
            constructor();
            parent: Photo;

            // Children
            content: Body.Content;
            frame: Body.Frame[];

            // Properties
            index: number;
            timeout: number;

            // Methods
            clear(): this;
        } interface Body {
            constructor: typeof Body;
        }

        namespace Body {
            abstract class Content extends Scroll.Content {
                parent: Body;
            }

            class Frame extends Scroll { ///////////////////////////////////////////////////////////////////////////// Frame ///
                constructor();
                parent: Content;

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

                // Methods
                clear(): this;
                setIndex(index: number): this;
            } interface Frame {
                constructor: typeof Frame;
            }

            namespace Frame {
                class Gizmo extends Element.HTML.Div { /////////////////////////////////////////////////////////// Gizmo ///
                    constructor();
                    parent: Scroll.Content;

                    // Children
                    image: Element.HTML.Image;

                    // Methods
                    clear(): this;
                    setImage(image: {
                        path: string
                        date: number
                        thumbnail: string
                    }): this;
                } interface Gizmo {
                    constructor: typeof Gizmo;
                }

                namespace Gizmo {
                    class Image extends Element.HTML.Image { ///////////////////////////////////////////////// Image ///
                        constructor();
                        parent: Gizmo;
                    } interface Image {
                        constructor: typeof Image;
                    }
                }
            }
        }

        class Close extends Element.HTML.Image, Touch { ////////////////////////////////////////////////////////////////// Close ///
            constructor();
            parent: Photo;
        } interface Close {
            constructor: typeof Close;
        }

        class Load extends Element.HTML.Div { ///////////////////////////////////////////////////////////////////////////// Load ///
            constructor();
            parent: Photo;
        } interface Load {
            constructor: typeof Load;
        }
    }
}