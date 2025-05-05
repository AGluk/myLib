declare namespace myLib {
    class Dialog extends Layer { //////////////////////////////////////////////////////////////////////////////////////////// Dialog ///
        constructor(id: string, className?: string);
        constructor(className: string);

        static onLoaded: () => void;

        // Children
        load: Dialog.Load;
        frame: Dialog.Frame;

        // Properties
        head: Dialog.Head;
        elements: Map<HTMLElement>;
        forms: Map<HTMLFormElement>;

        content_AJAX: XMLHttpRequest;
        script_AJAX: XMLHttpRequest;
        style_AJAX: XMLHttpRequest;

        // Accessors
        get className(): string;
        set className(className: string): void;

        get modal(): boolean;
        set modal(value: boolean);
        modal_: boolean;

        // Events
        onLoaded(): void;

        // Listeners
        onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
        onTap(target?: HTMLElement): boolean | void;

        // Methods
        append(modal?: boolean, ...arguments: any[]): this;
        clear(): this;
        remove(...arguments: any[]): this;
        scrollBy(dX: number, dY: number): this;
        scrollTo(left: number, top: number, duration?: number, callback?: () => void): this;
        setContent(body: string, head?: string): this;
        setSrc(src: string): this;
    } interface Dialog {
        constructor: Dialog;
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

            // Listeners
            onResize(capture?: boolean): boolean | void;
        } interface Frame {
            constructor: Frame;
        }

        namespace Frame {
            class Head extends Element.HTML.Div, Touch { ////////////////////////////////////////////////////////////// Head ///
                constructor();
                parent: Frame;

                // Listeners
                onTap(target?: HTMLElement): boolean | void;
            } interface Head {
                constructor: Head;
            }

            class Body extends Scroll { /////////////////////////////////////////////////////////////////////////////// Body ///
                constructor();
                parent: Frame;

                // Accessors
                get innerHTML(): string;
                set innerHTML(value: string);

                // Properties
                elements: Map<HTMLElement>;
                forms: Map<HTMLFormElement>;
            } interface Body {
                constructor: Body;
            }

            class Close extends Element.HTML.Div, Touch { //////////////////////////////////////////////////////////// Close ///
                constructor();
                parent: Frame;
            } interface Close {
                constructor: Close;
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
            constructor: Head;
        }

        class Load extends Element.HTML.Image { /////////////////////////////////////////////////////////////////////////// Load ///
            constructor();
            parent: Dialog;
        } interface Load {
            constructor: Load;
        }
    }

    let dialogs: Map<Dialog | null>;
}