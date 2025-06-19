declare namespace myLib {
    class LayersBox extends Element.HTML.Div { /////////////////////////////////////////////////////////////////////////// LayersBox ///
        constructor(target?: HTMLDivElement, className?: string, id?: string);
        constructor(className?: string, id?: string);

        // Static
        static default: LayersBox;

        // Properties
        children: Layer[];
        fixed: boolean;

        // Overrides
        appendChild<T extends Element>(child: T): T;
        defineChild<T extends Element>(name: string, child: T): T;
        removeChild(child: Element, ...args: any[]): number;
        removeChildren(...args: any[]): this;
        insertBefore<T extends Element>(child: T, ref_child: Element): T;
        replaceChild<T extends Element>(child: T, ref_child: Element): T;

        // Methods
        appendToBody(): this;
    } interface LayersBox {
        constructor: typeof LayersBox;
    }

    namespace LayersBox {
        class CSSStyle extends myLib.Element.HTML.CSSStyle { ////////////////////////////////////////////////////////// CSSStyle ///
            constructor(target: Element);

            // Properties
            target: LayersBox;

            // Accessors
            get position(): string;
            set position(value: string);

            // Methods
            removeProperty(property: string): this;
        } interface CSSStyle {
            constructor: typeof CSSStyle;
        }
    }

    class Layer extends Element.HTML.Div { /////////////////////////////////////////////////////////////////////////////////// Layer ///
        constructor(className?: string, id?: string);
        parent: LayersBox;

        // Properties
        layersBox: LayersBox | null;

        // Methods
        append(layersBox?: LayersBox, focus = false): this;
        remove(...args: any[]): this;
    } interface Layer extends Touch {
        constructor: typeof Layer;
    }
}