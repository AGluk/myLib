declare namespace myLib {
    class Loading extends Layer { ////////////////////////////////////////////////////////////////////////////////////////// Loading ///
        constructor();

        // Children
        bar: Loading.Bar;
        icon: Loading.Icon;

        // Accessors
        get className(): string;
        set className(value: string);

        // Events
        onAbort(): boolean | void;

        // Listeners
        onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
        onTap(target?: HTMLElement): boolean | void;

        // Methods
        set(progress: number): this;
    } interface Loading {
        constructor: Loading;
    }

    namespace Loading {
        class Bar extends Element.SVG.SVG { //////////////////////////////////////////////////////////////////////////////// Bar ///
            constructor();
            parent: Loading;

            // Children
            gizmo: Bar.Gizmo;
            lever: Bar.Lever;
        } interface Bar {
            constructor: Bar;
        }

        namespace Bar {
            class Gizmo extends Element.SVG.Circle { ///////////////////////////////////////////////////////////////// Gizmo ///
                constructor();
                parent: Bar;
            } interface Gizmo {
                constructor: Gizmo;
            }

            class Lever extends Element.SVG.Path { /////////////////////////////////////////////////////////////////// Lever ///
                constructor();
                parent: Bar;
            } interface Lever {
                constructor: Lever;
            }
        }

        class Icon extends Element.HTML.Image { /////////////////////////////////////////////////////////////////////////// Icon ///
            constructor();
            parent: Loading;
        } interface Icon {
            constructor: Icon;
        }
    }
}