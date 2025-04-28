declare namespace myLib {
    class Layer extends Element.HTML.Div { /////////////////////////////////////////////////////////////////////////////////// Layer ///
        constructor(className?: string, id?: string);

        static LANDSCAPE: Layer.Orientation;
        static PORTRAIT: Layer.Orientation;

        // Properties
        layer: HTMLDivElement;
        below: Layer | null;

        // Events
        onAppend(...arguments: any[]): void;
        onDocumentHide(): void;
        onDocumentShow(): void;
        onOrientation(alpha: number | null, beta: number | null, gamma: number | null): void;
        onOrientationChange(orientation: Layer.Orientation): void;
        onRemove(...arguments: any[]): void;

        // Methods
        append(...arguments: any[]): this;
        remove(...arguments: any[]): this;
    } interface Layer extends Touch {
        constructor: Layer;

        // Listeners
        onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
        onTap(target?: HTMLElement): boolean | void;
    }

    namespace Layer {
        enum Orientation {
            LANDSCAPE,
            PORTRAIT
        }
    }
}