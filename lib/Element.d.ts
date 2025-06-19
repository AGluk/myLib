declare namespace myLib {
    class Element extends myLib { ////////////////////////////////////////////////////////////////////////////////////////// Element ///
        constructor(target: Window.Element, className?: string, id?: string);

        // Static
        static className?: string;

        // Properties
        target: Window.Element;
        parent: Element | null;
        children: Element[];

        classList_origin: Element.ClassListOrigin;
        classList_extensions: Element.ClassListExtensions;
        classList_custom: string[];

        // Accessors
        get classList(): DOMTokenList;

        get className(): string;
        set className(value: string);

        get className_origin(): string;

        get clientWidth(): number;
        get clientHeight(): number;

        get id(): string;
        set id(value: string);

        get innerHTML(): string;
        set innerHTML(value: string);

        // Events
        onAppend(): void;
        onRemove(...args: any[]): void;
        onDefinedAsChild(): void;
        onResize(capture?: boolean): boolean | void;

        // Methods
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this;
        addExtendedClassNames(extension: string): this;
        remExtendedClassNames(extension?: string): this;
        appendChild<T extends Element>(child: T): T;
        appendChildren(...child: Element): this;
        defineChild<T extends Element>(name: string, child: T): T;
        removeChild(child: Element, ...args: any[]): number;
        removeChildren(...args: any[]): this;
        insertBefore<T extends Element>(child: T, ref_child: Element): T;
        replaceChild<T extends Element>(child: T, ref_child: Element): T;
        extends<T extends typeof myLib>(constructor: T, arguments?: any[]): ExtendsReturn;
        getAttribute(name: string): string | null;
        getAttributeNS(namespace: string, localname: string): string | null;
        getBoundingClientRect(): DOMRect;
        getComputedStyle(): CSSStyleDeclaration;
        hasAttribute(name: string): boolean;
        hasAttributeNS(namespace: string, localname: string): boolean;
        iterateDOM(callback: (child: Window.Element) => boolean, element?: Window.Element): void;
        requestFullscreen(): this;
        resize(): this;
        setAttribute(name: string, value: string): this;
        remAttribute(name: string): this;
        remAttributes(): this;
        setAttributeNS(namespace: string, name: string, value: string): this;
        remAttributeNS(namespace: string, name: string): this;
    } interface Element {
        constructor: typeof Element;
    }

    namespace Element {
        class ClassListOrigin extends myLib { ////////////////////////////////////////////////////////////////// ClassListOrigin ///
            constructor(classList?: string[]);

            // Properties
            target: {
                className: string
                inherited: boolean
            }[];

            // Accessors
            [Symbol.iterator](): Generator<string>;
            get inherited(): string[];
            get length(): number;

            // Methods
            add(className: string, inherited = true): this;
            push(className: string, inherited = true): this;
            forEach(callback: (className: string, inherited: boolean) => void): this;
            forEachInherited(callback: (className: string) => void): this;
            map(callback: (extension: string) => string): string[];
            setInheritance(callback: (className: string) => boolean): void;
        } interface ClassListOrigin {
            constructor: ClassListOrigin;
        }

        class ClassListExtensions extends myLib { ////////////////////////////////////////////////////////// ClassListExtensions ///
            constructor(extensions?: string[]);

            // Properties
            target: string[];

            // Accessors
            [Symbol.iterator](): Generator<string>;
            get length(): number;

            // Methods
            add(extension: string): this;
            del(extension: string): this;
            clear(): this;
            from(extensions?: ClassListExtensions): this;
            forEach(callback: (extension: string) => void): this;
            map(callback: (extension: string) => string): string[];
        } interface ClassListExtensions {
            constructor: ClassListExtensions;
        }

        class HTML extends Element { ////////////////////////////////////////////////////////////////////////////////////// HTML ///
            constructor(target: HTMLElement, className?: string, id?: string);

            // Properties
            target: HTMLElement;
            parent: Element.HTML | null;
            style: HTML.CSSStyle;

            // Accessors
            get offsetTop(): number;
            get offsetLeft(): number;

            get offsetWidth(): number;
            get offsetHeight(): number;

            get scrollTop(): number;
            set scrollTop(value: number)

            get scrollLeft(): number;
            set scrollLeft(value: number);

            get scrollWidth(): number;
            get scrollHeight(): number;

            get tabIndex(): number;
            set tabIndex(value: number);

            get title(): string;
            set title(value: string);

            // Methods
            append(): this;
            focus(preventScroll = false): this;
            hide(): this;
            remove(): this;
            show(): this;
        } interface HTML {
            constructor: typeof HTML;
        }

        namespace HTML {
            class Canvas extends HTML { ///////////////////////////////////////////////////////////////////////////// Canvas ///
                constructor(target?: HTMLCanvasElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: HTMLCanvasElement;

                // Accessors
                get width(): number;
                set width(value: number);

                get height(): number;
                set height(value: number);

                // Methods
                getContext2D(contextAttributes?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D;
                getContext3D(contextAttributes?: WebGLContextAttributes): WebGLRenderingContext;
            } interface Canvas {
                constructor: typeof Canvas;
            }

            class Div extends HTML { /////////////////////////////////////////////////////////////////////////////////// Div ///
                constructor(target?: HTMLDivElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: HTMLDivElement;
            } interface Div {
                constructor: typeof Div;
            }

            class Form extends HTML { ///////////////////////////////////////////////////////////////////////////////// Form ///
                constructor(target?: HTMLFormElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: HTMLFormElement;

                // Accessors
                get name(): string;
                set name(value: string);
            } interface Form {
                constructor: typeof Form;
            }

            class IFrame extends HTML { ///////////////////////////////////////////////////////////////////////////// IFrame ///
                constructor(target?: HTMLIFrameElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: HTMLIFrameElement;

                // Events
                onLoaded(): void;

                // Accessors
                get contentWindow(): Window;

                get src(): string;
                set src(value: string);

                // Methods
                postMessage(data: any): this;
            } interface IFrame {
                constructor: typeof IFrame;
            }

            class Image extends HTML { /////////////////////////////////////////////////////////////////////////////// Image ///
                constructor(target?: HTMLImageElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: HTMLImageElement;

                // Events
                onLoaded(): void;

                // Accessors
                get alt(): string;
                set alt(value: string);

                get crossOrigin(): string;
                set crossOrigin(value: string);

                get src(): string;
                set src(value: string);

                // Methods
                clear(): this;
                setSrc(src: string): this;
            } interface Image {
                constructor: typeof Image;
            }

            class Input extends HTML { /////////////////////////////////////////////////////////////////////////////// Input ///
                constructor(target?: HTMLInputElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: HTMLInputElement;

                // Accessors
                get autocomplete(): string;
                set autocomplete(value: string);

                get checked(): boolean;
                set checked(value: boolean);

                get disabled(): boolean;
                set disabled(value: boolean);

                get name(): string;
                set name(value: string);

                get selectionEnd(): number;
                set selectionEnd(value: number);

                get selectionStart(): number;
                set selectionStart(value: number);

                get type(): string;
                set type(value: string);

                get value(): string;
                set value(value: string);

                // Methods
                enable(): this;
                disable(): this;
                setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none"): this;
            } interface Input {
                constructor: typeof Input;
            }

            class Link extends HTML { ///////////////////////////////////////////////////////////////////////////////// Link ///
                constructor(target?: HTMLLinkElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: HTMLLinkElement;

                // Events
                onLoaded(): void;

                // Accessors
                get href(): string;
                set href(value: string);

                get rel(): string;
                set rel(value: string);
            } interface Link {
                constructor: typeof Link;
            }

            class Script extends HTML { ///////////////////////////////////////////////////////////////////////////// Script ///
                constructor(innerHTML?: string);

                // Properties
                target: HTMLScriptElement;

                // Events
                onLoaded(): void;

                // Accessors
                get src(): string;
                set src(value: string);

                // Methods
                append(): this;
                remove(): this;
                setSrc(src: string): this;
            } interface Script {
                constructor: typeof Script;
            }

            class Style extends HTML { /////////////////////////////////////////////////////////////////////////////// Style ///
                constructor(innerHTML?: string);

                // Properties
                target: HTMLStyleElement;

                // Methods
                append(): this;
                remove(): this;
            } interface Style {
                constructor: typeof Style;
            }

            class Table extends HTML { /////////////////////////////////////////////////////////////////////////////// Table ///
                constructor(target?: HTMLTableElement, className?: string, id?: string);
                constructor(target?: HTMLTableElement, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: HTMLTableElement;
            } interface Table {
                constructor: typeof Table;
            }

            namespace Table {
                class Body extends HTML { ///////////////////////////////////////////////////////////////////////// Body ///
                    constructor(target?: HTMLTableSectionElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    // Properties
                    target: HTMLTableSectionElement;
                } interface Body {
                    constructor: typeof Body;
                }

                class Cell extends HTML { ///////////////////////////////////////////////////////////////////////// Cell ///
                    constructor(target?: HTMLTableCellElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    // Properties
                    target: HTMLTableCellElement;
                } interface Cell {
                    constructor: typeof Cell;
                }

                class Col extends HTML { /////////////////////////////////////////////////////////////////////////// Col ///
                    constructor(target?: HTMLTableColElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    // Properties
                    target: HTMLTableColElement;
                } interface Col {
                    constructor: typeof Col;
                }

                class Head extends HTML { ///////////////////////////////////////////////////////////////////////// Head ///
                    constructor(target?: HTMLTableSectionElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    // Properties
                    target: HTMLTableSectionElement;
                } interface Head {
                    constructor: typeof Head;
                }

                class Row extends HTML { /////////////////////////////////////////////////////////////////////////// Row ///
                    constructor(target?: HTMLTableRowElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    // Properties
                    target: HTMLTableRowElement;
                } interface Row {
                    constructor: typeof Row;
                }
            }

            class CSSStyle extends myLib { //////////////////////////////////////////////////////////////////////// CSSStyle ///
                constructor(target: Element);

                // Properties
                target: Element;
                target_get: CSSStyleDeclaration;
                target_set: CSSStyleDeclaration;

                // Accessors
                get top(): number;
                set top(value: number | string);

                get left(): number;
                set left(value: number | string);

                get right(): number;
                set right(value: number | string);

                get bottom(): number;
                set bottom(value: number | string);

                get inset(): number[];
                set inset(value: number[] | string);

                get width(): number;
                set width(value: number | string);

                get maxWidth(): number;
                set maxWidth(value: number | string);

                get height(): number;
                set height(value: number | string);

                get maxHeight(): number;
                set maxHeight(value: number | string);

                get background(): string;
                set background(value: string);

                get backgroundColor(): string;
                set backgroundColor(value: string);

                get backgroundImage(): string;
                set backgroundImage(value: string);

                get borderRadius(): number;
                set borderRadius(value: number);

                get cursor(): string;
                set cursor(value: string);

                get display(): string;
                set display(value: string);

                get margin(): number[];
                set margin(value: number[] | string);

                get marginTop(): number;
                set marginTop(value: number | string);

                get marginLeft(): number;
                set marginLeft(value: number | string);

                get marginRight(): number;
                set marginRight(value: number | string);

                get marginBottom(): number;
                set marginBottom(value: number | string);

                get opacity(): number;
                set opacity(value: number);

                get padding(): number[];
                set padding(value: number[] | string);

                get paddingTop(): number;
                set paddingTop(value: number | string);

                get paddingLeft(): number;
                set paddingLeft(value: number | string);

                get paddingRight(): number;
                set paddingRight(value: number | string);

                get paddingBottom(): number;
                set paddingBottom(value: number | string);

                get pointerEvents(): string;
                set pointerEvents(value: string);

                get position(): string;
                set position(value: string);

                get perspective(): number;
                set perspective(value: number);

                get transform(): string;
                set transform(value: string);

                get transformOrigin(): string;
                set transformOrigin(value: string);

                get transformStyle(): string;
                set transformStyle(value: string);

                get transition(): string;
                set transition(value: string);

                get zIndex(): number;
                set zIndex(value: number);

                // Methods
                removeProperty(property: string): this;
            } interface CSSStyle {
                constructor: typeof CSSStyle;
            }
        }

        class SVG extends Element { //////////////////////////////////////////////////////////////////////////////////////// SVG ///
            constructor(target: SVGGraphicsElement, className?: string, id?: string);

            // Properties
            target: SVGGraphicsElement;
            parent: Element.SVG;
            style: SVG.CSSStyle;
            transform: string[];

            // Methods
            append(): this;
            focus(preventScroll = false): this;
            getBBox(options?: SVGBoundingBoxOptions): DOMRect;
            hide(): this;
            matrix(M: number[]): this;
            position(x: number, y: number): this;
            remove(): this;
            reset(): this;
            rotate(a: number, x: number = 0, y: number = 0): this;
            scale(x: number, y: number): this;
            skewX(a: number);
            skewY(a: number);
            show(): this;
            transformOrigin(): this;
            translate(x: number, y: number): this;
            update(): this;
        } interface SVG {
            constructor: typeof SVG;
        }

        namespace SVG {
            class Circle extends Element.SVG { ////////////////////////////////////////////////////////////////////// Circle ///
                constructor(target?: SVGCircleElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: SVGCircleElement;

                // Accessors
                get cx(): number;
                set cx(value: number);

                get cy(): number;
                set cy(value: number);

                get r(): number;
                set r(value: number);

                // Methods
                set(cx: number, cy: number, r: number): this;
            } interface Circle {
                constructor: typeof Circle;
            }

            class Ellipse extends Element.SVG { //////////////////////////////////////////////////////////////////// Ellipse ///
                constructor(target?: SVGEllipseElement | SVGCircleElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: SVGEllipseElement | SVGCircleElement;

                // Accessors
                get cx(): number;
                set cx(value: number);

                get cy(): number;
                set cy(value: number);

                get r(): number;
                set r(value: number);

                get rx(): number;
                set rx(value: number);

                get ry(): number;
                set ry(value: number);

                // Methods
                set(cx: number, cy: number, rx: number, ry: number): this;
            } interface Ellipse {
                constructor: typeof Ellipse;
            }

            class Geometry extends Element.SVG { ////////////////////////////////////////////////////////////////// Geometry ///
                constructor(target?: SVGGeometryElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: SVGGeometryElement;
            } interface Geometry {
                constructor: typeof Geometry;
            }

            class Group extends Element.SVG { //////////////////////////////////////////////////////////////////////// Group ///
                constructor(target?: SVGGElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: SVGGElement;
            } interface Group {
                constructor: typeof Group;
            }

            class Path extends Element.SVG { ////////////////////////////////////////////////////////////////////////// Path ///
                constructor(target?: SVGPathElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: SVGPathElement;

                // Accessors
                get d(): string;
                set d(value: string);

                // Methods
                set(d: string): this;
            } interface Path {
                constructor: typeof Path;
            }

            class Rect extends Element.SVG { ////////////////////////////////////////////////////////////////////////// Rect ///
                constructor(target?: SVGRectElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: SVGRectElement;

                // Accessors
                get x(): number;
                set x(value: number);

                get y(): number;
                set y(value: number);

                get width(): number;
                set width(value: number);

                get height(): number;
                set height(value: number);

                get rx(): number;
                set rx(value: number);

                get ry(): number;
                set ry(value: number);

                // Methods
                set(x: number, y: number, width: number, height: number, rx: number = 0, ry: number = 0): this;
            } interface Rect {
                constructor: typeof Rect;
            }

            class SVG extends Element.SVG { //////////////////////////////////////////////////////////////////////////// SVG ///
                constructor(target?: SVGSVGElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                // Properties
                target: SVGSVGElement;

                // Accessors
                get x(): number;
                set x(value: number);

                get y(): number;
                set y(value: number);

                get width(): number;
                set width(value: number);

                get height(): number;
                set height(value: number);

                get viewBox(): number[];
                set viewBox(value: number[]);

                // Methods
                removeAttributes(): this;
            } interface SVG {
                constructor: typeof SVG;
            }

            class CSSStyle extends myLib.Element.HTML.CSSStyle { ////////////////////////////////////////////////// CSSStyle ///
                constructor(target: Element.SVG);

                // Properties
                target_get: CSSStyleDeclaration;
                target_set: CSSStyleDeclaration;

                // Accessors
                get fill(): string;
                set fill(value: string);

                get fillOpacity(): number;
                set fillOpacity(value: number);

                get stroke(): string;
                set stroke(value: string);

                get strokeOpacity(): number;
                set strokeOpacity(value: number);
            } interface CSSStyle {
                constructor: typeof CSSStyle;
            }
        }
    }
}

declare interface Element {
    readonly my_class: myLib.Element;
}