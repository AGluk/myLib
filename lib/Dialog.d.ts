declare namespace myLib {
    const dialogs: Map<Dialog | null>;

    class Dialog extends Layer { //////////////////////////////////////////////////////////////////////////////////////////// Dialog ///
        constructor(className?: string, id?: string);

        // Children
        load: Dialog.Load;
        frame: Dialog.Frame;

        // Properties
        head: Dialog.Head;
        elements: Map<Window.Element>;
        forms: Map<HTMLFormElement>;
        modal_: boolean;

        content_AJAX: XMLHttpRequest;
        script_AJAX: XMLHttpRequest;
        style_AJAX: XMLHttpRequest;

        // Events
        onLoaded(): void;

        // Overrides
        append(layersBox?: LayersBox, focus = false): this;
        remove(...args: any[]): this;
        scrollBy(dX: number, dY: number): this;
        scrollTo(left: number, top: number, duration?: number, callback?: () => void): this;

        // Methods
        clear(): this;
        modal(modal: boolean): this;
        setContent(body: string, head?: string): this;
        setSrc(src: string): this;
    } interface Dialog {
        constructor: typeof Dialog;
    }

    namespace Dialog {
        class Frame extends Element.HTML.Div { /////////////////////////////////////////////////////////////////////////// Frame ///
            constructor();
            parent: Dialog;

            // Children
            head: Frame.Head;
            body: Frame.Body;
            close: Frame.Close;

            // Properties
            top: number;
            left: number;
            width: number;
            height: number;
        } interface Frame {
            constructor: typeof Frame;
        }

        namespace Frame {
            class Head extends Element.HTML.Div, Touch { ////////////////////////////////////////////////////////////// Head ///
                constructor();
                parent: Frame;
            } interface Head {
                constructor: typeof Head;
            }

            class Body extends Scroll { /////////////////////////////////////////////////////////////////////////////// Body ///
                constructor();
                parent: Frame;

                // Accessors
                get innerHTML(): string;
                set innerHTML(value: string);

                // Properties
                elements: Map<Window.Element>;
                forms: Map<HTMLFormElement>;
                tracked: List<Body.Traced>;

                // Overrides
                addExtendedClassNames(extension: string): this;
                remExtendedClassNames(extension?: string): this;
            } interface Body {
                constructor: typeof Body;
            }

            namespace Body {
                class Tracked extends myLib { ////////////////////////////////////////////////////////////////// Tracked ///
                    constructor(target: Window.Element, parent: Dialog);

                    target: Window.Element;

                    // Properties
                    classList_origin: string[];
                    classList_extensions: Element.ClassListExtensions;

                    // Methods
                    update(): this;
                } interface Tracked {
                    constructor: typeof Tracked;
                }
            }

            class Close extends Element.HTML.Div, Touch { //////////////////////////////////////////////////////////// Close ///
                constructor();
                parent: Frame;
            } interface Close {
                constructor: typeof Close;
            }
        }

        class Head extends myLib { //////////////////////////////////////////////////////////////////////////////////////// Head ///
            constructor();

            // Properties
            script: Element.HTML.Script;
            style: Element.HTML.Style;

            // Methods
            append(): this;
            remove(): this;
        } interface Head {
            constructor: typeof Head;
        }

        class Load extends Element.HTML.Div { ///////////////////////////////////////////////////////////////////////////// Load ///
            constructor();
            parent: Dialog;
        } interface Load {
            constructor: typeof Load;
        }
    }
}