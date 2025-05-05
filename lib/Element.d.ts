declare namespace myLib {
    class Element extends myLib { ////////////////////////////////////////////////////////////////////////////////////////// Element ///
        constructor(target: Window.Element, className?: string, id?: string);
        target: Window.Element;

        // Properties
        children: Element[];
        parent: Element | null;

        // Accessors
        get classList(): DOMTokenList;

        get className(): string;
        set className(value: string);

        get clientWidth(): number;
        get clientHeight(): number;

        get id(): string;
        set id(value: string);

        get innerHTML(): string;
        set innerHTML(value: string);

        // Events
        onResize(capture?: boolean): boolean | void;

        // Methods
        appendChild<T>(child: T): T;
        defineChild<T>(name: string, child: T): T;
        getAttribute(name: string): string | null;
        getAttributeNS(namespace: string, localname: string): string | null;
        getBoundingClientRect(): ClientRect | DOMRect;
        getComputedStyle(): CSSStyleDeclaration;
        hasAttribute(name: string): boolean;
        hasAttributeNS(namespace: string, localname: string): boolean;
        insertBefore(child: Element, ref_child: Element): boolean;
        iterateDOM(callback: (child: Window.Element) => boolean, element?: Window.Element): void;
        resize(): this;
        removeAttribute(name: string): this;
        removeAttributes(): this;
        removeChild(child: Element): this;
        removeChildren(): this;
        replaceChild<T>(child: T, ref_child: Element): T;
        setAttribute(name: string, value: string): this;
        setAttributeNS(namespace: string, localname: string, value: string): this;
    } interface Element {
        constructor: Element;
    }

    namespace Element {
        class HTML extends Element { ////////////////////////////////////////////////////////////////////////////////////// HTML ///
            constructor(target?: HTMLElement, className?: string, id?: string);
            target: HTMLElement;

            // Properties
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
            addEventListener(
                event: keyof HTMLElementEventMap,
                listener: (event: Event) => void,
                options?: boolean | AddEventListenerOptions): this;

            append(): this;
            focus(): this;
            hide(): this;
            remove(): this;
            show(): this;
        } interface HTML {
            constructor: HTML;
        }

        namespace HTML {
            class Canvas extends HTML { ///////////////////////////////////////////////////////////////////////////// Canvas ///
                constructor(target?: HTMLCanvasElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

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
                constructor: Canvas;
            }

            class Div extends HTML { /////////////////////////////////////////////////////////////////////////////////// Div ///
                constructor(target?: HTMLDivElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                target: HTMLDivElement;
            } interface Div {
                constructor: Div;
            }

            class Form extends HTML { ///////////////////////////////////////////////////////////////////////////////// Form ///
                constructor(target?: HTMLFormElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                target: HTMLFormElement;

                // Accessors
                get name(): string;
                set name(value: string);
            } interface Form {
                constructor: Form;
            }

            class IFrame extends HTML { ///////////////////////////////////////////////////////////////////////////// IFrame ///
                constructor(target?: HTMLIFrameElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

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
                constructor: IFrame;
            }

            class Image extends HTML { /////////////////////////////////////////////////////////////////////////////// Image ///
                constructor(target?: HTMLImageElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                target: HTMLImageElement;

                // Events
                onLoaded(): void;

                // Accessors
                get alt(): string;
                set alt(value: string);

                get src(): string;
                set src(value: string);

                // Methods
                clear(): this;
            } interface Image {
                constructor: Image;
            }

            class Input extends HTML { /////////////////////////////////////////////////////////////////////////////// Input ///
                constructor(target?: HTMLInputElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

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
                constructor: Input;
            }

            class Link extends HTML { ///////////////////////////////////////////////////////////////////////////////// Link ///
                constructor(target?: HTMLLinkElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                target: HTMLLinkElement;

                // Accessors
                get href(): string;
                set href(value: string);

                get rel(): string;
                set rel(value: string);
            } interface Link {
                constructor: Link;
            }

            class Script extends HTML { ///////////////////////////////////////////////////////////////////////////// Script ///
                constructor(innerHTML: string = '');
                target: HTMLScriptElement;

                // Methods
                append(): this;
                remove(): this;
            } interface Script {
                constructor: Script;
            }

            class Style extends HTML { /////////////////////////////////////////////////////////////////////////////// Style ///
                constructor(innerHTML: string = '');
                target: HTMLStyleElement;

                // Methods
                append(): this;
                remove(): this;
            } interface Style {
                constructor: Style;
            }

            class Table extends HTML { /////////////////////////////////////////////////////////////////////////////// Table ///
                constructor(target?: HTMLTableElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                target: HTMLTableElement;
            } interface Table {
                constructor: Table;
            }

            namespace Table {
                class Body extends HTML { ///////////////////////////////////////////////////////////////////////// Body ///
                    constructor(target?: HTMLTableSectionElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    target: HTMLTableSectionElement;
                } interface Body {
                    constructor: Body;
                }

                class Cell extends HTML { ///////////////////////////////////////////////////////////////////////// Cell ///
                    constructor(target?: HTMLTableCellElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    target: HTMLTableCellElement;
                } interface Cell {
                    constructor: Cell;
                }

                class Col extends HTML { /////////////////////////////////////////////////////////////////////////// Col ///
                    constructor(target?: HTMLTableColElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    target: HTMLTableColElement;
                } interface Col {
                    constructor: Col;
                }

                class Head extends HTML { ///////////////////////////////////////////////////////////////////////// Head ///
                    constructor(target?: HTMLTableSectionElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    target: HTMLTableSectionElement;
                } interface Head {
                    constructor: Head;
                }

                class Row extends HTML { /////////////////////////////////////////////////////////////////////////// Row ///
                    constructor(target?: HTMLTableRowElement, className?: string, id?: string);
                    constructor(className?: string, id?: string);

                    target: HTMLTableRowElement;
                } interface Row {
                    constructor: Row;
                }
            }

            class CSSStyle extends myLib { //////////////////////////////////////////////////////////////////////// CSSStyle ///
                constructor(target: HTMLElement);

                // Properties
                target_get: CSSStyleDeclaration;
                target_set: CSSStyleDeclaration;

                // Accessors
                get top(): number;
                set top(value: number);

                get left(): number;
                set left(value: number);

                get right(): number;
                set right(value: number);

                get bottom(): number;
                set bottom(value: number);

                get width(): number;
                set width(value: number);

                get maxWidth(): number;
                set maxWidth(value: number);

                get height(): number;
                set height(value: number);

                get maxHeight(): number;
                set maxHeight(value: number);

                get background(): string;
                set background(value: string);

                get backgroundImage(): string;
                set backgroundImage(value: string);

                get display(): string;
                set display(value: string);

                get margin(): number[];
                set margin(value: number[]);

                get marginTop(): number;
                set marginTop(value: number);

                get marginLeft(): number;
                set marginLeft(value: number);

                get marginRight(): number;
                set marginRight(value: number);

                get marginBottom(): number;
                set marginBottom(value: number);

                get opacity(): number;
                set opacity(value: number);

                get padding(): number[];
                set padding(value: number[]);

                get paddingTop(): number;
                set paddingTop(value: number);

                get paddingLeft(): number;
                set paddingLeft(value: number);

                get paddingRight(): number;
                set paddingRight(value: number);

                get paddingBottom(): number;
                set paddingBottom(value: number);

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

                get transition(): string;
                set transition(value: string);

                get zIndex(): number;
                set zIndex(value: number);

                // Methods

                removeProperty(property: string): this;
            } interface CSSStyle {
                constructor: CSSStyle;
            }
        }

        class SVG extends Element { //////////////////////////////////////////////////////////////////////////////////////// SVG ///
            constructor(target: SVGGraphicsElement, className?: string, id?: string);
            target: SVGGraphicsElement;

            // Properties
            style: SVG.CSSStyle;
            transform: string[];

            // Accessors
            get className(): string;
            set className(value: string);

            get id(): string;
            set id(value: string);

            // Methods
            append(): this;
            focus(): this;
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
            constructor: SVG;
        }

        namespace SVG {
            class Circle extends Element.SVG { ////////////////////////////////////////////////////////////////////// Circle ///
                constructor(target?: SVGCircleElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

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
                constructor: Circle;
            }

            class Ellipse extends Element.SVG { //////////////////////////////////////////////////////////////////// Ellipse ///
                constructor(target?: SVGEllipseElement | SVGCircleElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

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
                constructor: Ellipse;
            }

            class Geometry extends Element.SVG { ////////////////////////////////////////////////////////////////// Geometry ///
                constructor(target?: SVGGeometryElement, className?: string, id?: string);
                target: SVGGeometryElement;
            } interface Path {
                constructor: Geometry;
            }

            class Group extends Element.SVG { //////////////////////////////////////////////////////////////////////// Group ///
                constructor(target?: SVGGElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                target: SVGGElement;
            } interface Group {
                constructor: Group;
            }

            class Path extends Element.SVG { ////////////////////////////////////////////////////////////////////////// Path ///
                constructor(target?: SVGPathElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

                target: SVGPathElement;

                // Accessors
                get d(): string;
                set d(value: string);

                // Methods
                set(d: string): this;
            } interface Path {
                constructor: Path;
            }

            class Rect extends Element.SVG { ////////////////////////////////////////////////////////////////////////// Rect ///
                constructor(target?: SVGRectElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

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
                constructor: Rect;
            }

            class SVG extends Element.SVG { //////////////////////////////////////////////////////////////////////////// SVG ///
                constructor(target?: SVGSVGElement, className?: string, id?: string);
                constructor(className?: string, id?: string);

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
                constructor: SVG;
            }

            class CSSStyle extends myLib.Element.HTML.CSSStyle { ////////////////////////////////////////////////// CSSStyle ///
                constructor(target: SVGGraphicsElement);

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
                constructor: CSSStyle;
            }
        }
    }
}