declare namespace myLib {
    class Page extends Layer { //////////////////////////////////////////////////////////////////////////////////////////////// Page ///
        constructor(className?: string, id?: string);

        // Static
        static onLoaded: () => void;

        // Children
        background: Page.Background;
        load: Page.Load;
        body: Page.Body;
        menu: Page.Menu;

        // Properties
        head: Page.Head;
        type: 'linear' | 'tabbed';

        elements: Map<Window.Element>;
        forms: Map<HTMLFormElement>;

        section: {
            body: myLib.Page.Body.Section
            menu: myLib.Page.Menu.Sections.Item
        }

        sections: Map<{
            body: myLib.Page.Body.Section
            menu: myLib.Page.Menu.Sections.Item
        }>;

        content_AJAX: XMLHttpRequest;
        script_AJAX: XMLHttpRequest;
        style_AJAX: XMLHttpRequest;

        // Overrides
        append(layersBox?: LayersBox, focus = false): this;
        remove(...args: any[]): this;
        scrollBy(dX: number, dY: number): this;
        scrollTo(left: number, top: number, duration?: number, callback?: () => void): this;

        // Methods
        setSection(id: string, duration?: number);
        setSrc(src: string, section?: string): this;
    } interface Page {
        constructor: typeof Page;
    }

    namespace Page {
        class Background extends Element.HTML.Div { ///////////////////////////////////////////////////////////////// Background ///
            constructor();
            parent: Page;
        } interface Background {
            constructor: typeof Background;
        }

        class Body extends Scroll { /////////////////////////////////////////////////////////////////////////////////////// Body ///
            constructor();
            parent: Page;

            // Children
            content: Body.Content;

            // Accessors
            get innerHTML(): string;
            set innerHTML(value: string);

            // Properties
            elements: Map<Window.Element>;
            forms: Map<HTMLFormElement>;
            sections: Map<myLib.Page.Body.Section>;
            tracked: List<Body.Tracked>;

            // Overrides
            addExtendedClassNames(extension: string): this;
            remExtendedClassNames(extension?: string): this;
        } interface Body {
            constructor: typeof Body;
        }

        namespace Body {
            abstract class Content extends Scroll.Content {
                parent: Body;
            }

            class Section extends myLib.Element.HTML.Div { ///////////////////////////////////////////////////////// Section ///
                constructor(target: Window.Element);
                parent: Content;

                // Methods
                init(parent: Content): this;
            } interface Section {
                constructor: typeof Section;
            }

            class Tracked extends myLib { ////////////////////////////////////////////////////////////////////////// Tracked ///
                constructor(target: Window.Element, parent: Page | Section);

                // Properties
                target: Window.Element;
                classList_origin: string[];
                classList_extensions: Element.ClassListExtensions;

                // Methods
                update(): this;
            } interface Tracked {
                constructor: typeof Tracked;
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
            parent: Page;
        } interface Load {
            constructor: typeof Load;
        }

        class Menu extends Element.HTML.Div { ///////////////////////////////////////////////////////////////////////////// Menu ///
            constructor();
            parent: Page;

            // Children
            sections: Menu.Sections;
        } interface Menu extends Touch {
            constructor: typeof Menu;
        }

        namespace Menu {
            class Sections extends Scroll { /////////////////////////////////////////////////////////////////////// Sections ///
                constructor();
                parent: Menu;

                // Children
                content: Sections.Content;
            } interface Sections {
                constructor: typeof Sections;
            }

            namespace Sections {
                abstract class Content extends Scroll.Content {
                    parent: Sections;
                }

                class Item extends myLib.Element.HTML.Div { /////////////////////////////////////////////////////// Item ///
                    constructor();
                    parent: Content;
                } interface Item {
                    constructor: typeof Item;
                }
            }
        }
    }
}