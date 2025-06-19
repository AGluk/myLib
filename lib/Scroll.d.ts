declare namespace myLib {
    class Scroll extends Element.HTML.Div { ///////////////////////////////////////////////////////////////////////////////// Scroll ///
        constructor(target?: HTMLDivElement, className?: string, id?: string);
        constructor(className?: string, id?: string);

        // Children
        content: Scroll.Content;
        hscroll: Scroll.Horizontal;
        vscroll: Scroll.Vertical;

        // Properties
        style: Scroll.CSSStyle;

        content_offsetWidth: number;
        content_offsetHeight: number;
        inertial: boolean;

        vX: number;
        vY: number;

        // Accessors
        get innerHTML(): string;
        set innerHTML(value: string);

        get scrollTop(): number;
        set scrollTop(value: number);
        scrollTop_: Animation.Property;

        get scrollLeft(): number;
        set scrollLeft(value: number);
        scrollLeft_: Animation.Property;

        set zoom(value: number);
        get zoom(): number;
        zoom_: Animation.Property;

        // Events
        onScroll(scrollLeft?: number, scrollTop?: number, zoom?: number): void;

        // Overrides
        appendChild<T extends Element>(child: T): T;
        defineChild<T extends Element>(name: string, child: T): T;
        removeChild(child: Element, ...args: any[]): number;
        removeChildren(...args: any[]): this;
        insertBefore<T extends Element>(child: T, ref_child: Element): T;
        replaceChild<T extends Element>(child: Element, ref_child: Element): T;
        iterateDOM(callback: (child: Window.Element) => boolean, element = this.content.target): void;

        // Methods
        scrollBy(dX: number, dY: number): this;
        scrollTo(left: number, top: number, zoom?: number, duration?: number, callback?: () => void): this;
    } interface Scroll extends Animation, Touch {
        constructor: typeof Scroll;
    }

    namespace Scroll {
        class CSSStyle extends Element.HTML.CSSStyle { //////////////////////////////////////////////////////////////// CSSStyle ///
            constructor(target: HTMLElement);

            // Accessors
            get width(): number;
            set width(value: number);
            width_: number;

            get height(): number;
            set height(value: number);
            height_: number;

            get paddingTop(): number;
            set paddingTop(value: number);
            paddingTop_: number;

            get paddingLeft(): number;
            set paddingLeft(value: number);
            paddingLeft_: number;

            get paddingRight(): number;
            set paddingRight(value: number);
            paddingRight_: number;

            get paddingBottom(): number;
            set paddingBottom(value: number);
            paddingBottom_: number;

            // Methods
            update(): this;
        } interface CSSStyle {
            constructor: typeof CSSStyle;
        }

        class Content extends Element.HTML.Div { /////////////////////////////////////////////////////////////////////// Content ///
            constructor();
            parent: Scroll;

            // Properties
            style: Scroll.CSSStyle;

            // Accessors
            get offsetWidth(): number;
            offsetWidth_: number;

            get offsetHeight(): number;
            offsetHeight_: number;

            // Methods
            translate(x: number, y: number): this;
        } interface Content {
            constructor: typeof Content;
        }

        namespace Content {
            class CSSStyle extends Element.HTML.CSSStyle { //////////////////////////////////////////////////////// CSSStyle ///
                constructor(target: HTMLElement);

                // Accessors
                get width(): number;
                set width(value: number);
                width_: number;

                get height(): number;
                set height(value: number);
                height_: number;

                get paddingTop(): number;
                set paddingTop(value: number);
                paddingTop_: number;

                get paddingLeft(): number;
                set paddingLeft(value: number);
                paddingLeft_: number;

                get paddingRight(): number;
                set paddingRight(value: number);
                paddingRight_: number;

                get paddingBottom(): number;
                set paddingBottom(value: number);
                paddingBottom_: number;

                // Methods
                update(): this;
            } interface CSSStyle {
                constructor: typeof CSSStyle;
            }
        }

        class Horizontal extends Element.HTML.Div { ///////////////////////////////////////////////////////////////// Horizontal ///
            constructor();
            parent: Scroll;

            // Children
            bar: Horizontal.Bar;

            // Properties
            timeout: number;

            // Methods
            hide(timeout?: number): this;
            set(left: number, right: number): this;
            show(timeout?: number): this;
        } interface Horizontal {
            constructor: typeof Horizontal;
        }

        namespace Horizontal {
            class Bar extends Element.HTML.Div { /////////////////////////////////////////////////////////////////////// Bar ///
                constructor();
                parent: Horizontal;

                // Children
                lever: Bar.Lever;
            } interface Bar {
                constructor: typeof Bar;
            }

            namespace Bar {
                class Lever extends Element.HTML.Div { /////////////////////////////////////////////////////////// Lever ///
                    constructor();
                    parent: Bar;

                    // Properties
                    style: Lever.CSSStyle;
                } interface Lever {
                    constructor: typeof Lever;
                }

                namespace Lever {
                    class CSSStyle extends Element.HTML.CSSStyle { //////////////////////////////////////// CSSStyle ///
                        constructor(target: HTMLElement);

                        // Accessors
                        get left(): number;
                        set left(value: number);

                        get right(): number;
                        set right(value: number);
                    } interface CSSStyle {
                        constructor: typeof CSSStyle;
                    }
                }
            }
        }

        class Vertical extends Element.HTML.Div { ///////////////////////////////////////////////////////////////////// Vertical ///
            constructor();
            parent: Scroll;

            // Children
            bar: Vertical.Bar;

            // Properties
            timeout: number;

            // Methods
            hide(timeout?: number): this;
            set(top: number, bottom: number): this;
            show(timeout?: number): this;
        } interface Vertical {
            constructor: typeof Vertical;
        }

        namespace Vertical {
            class Bar extends Element.HTML.Div { ////////////////////////////////////////////////////////////////// Vertical ///
                constructor();
                parent: Vertical;

                // Children
                lever: Bar.Lever;
            } interface Bar {
                constructor: typeof Bar;
            }

            namespace Bar {
                class Lever extends Element.HTML.Div { /////////////////////////////////////////////////////////// Lever ///
                    constructor();
                    parent: Bar;

                    // Properties
                    style: Lever.CSSStyle;
                } interface Lever {
                    constructor: typeof Lever;
                }

                namespace Lever {
                    class CSSStyle extends Element.HTML.CSSStyle { //////////////////////////////////////// CSSStyle ///
                        constructor(target: HTMLElement);

                        // Accessors
                        get top(): number;
                        set top(value: number | string);

                        get bottom(): number;
                        set bottom(value: number | string);
                    } interface CSSStyle {
                        constructor: typeof CSSStyle;
                    }
                }
            }
        }
    }
}