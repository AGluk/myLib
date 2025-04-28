declare namespace myLib {
    class Page extends Layer { //////////////////////////////////////////////////////////////////////////////////////////////// Page ///
        constructor(id: string, className?: string);
        constructor(className: string);

        static onLoaded: () => void;

        // Children
        background: Page.Background;
        load: Page.Load;
        body: Page.Body;
        menu: Page.Menu;

        // Properties
        head: Page.Head;

        elements: Map<HTMLElement>;
        forms: Map<HTMLFormElement>;

        section: {
            body: HTMLDivElement
            menu: HTMLDivElement
        } | undefined;

        sections: Map<{
            body: HTMLDivElement
            menu: HTMLDivElement
        }>;

        content_AJAX: XMLHttpRequest;
        script_AJAX: XMLHttpRequest;
        style_AJAX: XMLHttpRequest;

        // Accessors
        get className(): string;
        set className(className: string): void;

        // Listeners
        onOrientationChange(orientation: Layer.Orientation): void;
        onResize(capture?: boolean): boolean | void;

        // Methods
        append(...arguments: any[]): this;
        remove(...arguments: any[]): this;
        scrollBy(dX: number, dY: number): this;
        scrollTo(left: number, top: number, duration?: number, callback?: () => void): this;
        setSection(id: string, duration?: number);
        setSrc(src: string, section?: string): this;
    } interface Page {
        constructor: Page;
    }

    namespace Page {
        class Background extends Element.HTML.Div { ///////////////////////////////////////////////////////////////// Background ///
            constructor();
            parent: Page;
        } interface Background {
            constructor: Background;
        }

        class Body extends Scroll { /////////////////////////////////////////////////////////////////////////////////////// Body ///
            constructor();
            parent: Page;

            // Accessors
            get innerHTML(): string;
            set innerHTML(value: string);

            // Properties
            elements: Map<HTMLElement>;
            forms: Map<HTMLFormElement>;
            sections: Map<HTMLElement>;
        } interface Body {
            constructor: Body;
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
            parent: Page;
        } interface Load {
            constructor: Load;
        }

        class Menu extends Element.HTML.Div { ///////////////////////////////////////////////////////////////////////////// Menu ///
            constructor();
            parent: Page;

            // Children
            sections: Menu.Sections;

            // Listeners
            onResize(capture?: boolean): boolean | void;
        } interface Menu extends Touch {
            constructor: Menu;

            // Listeners
            onTap(target?: HTMLElement): boolean | void;
        }

        namespace Menu {
            class Sections extends Scroll { /////////////////////////////////////////////////////////////////////// Sections ///
                constructor();
                parent: Menu;
            } interface Sections {
                constructor: Sections;
            }
        }
    }
}