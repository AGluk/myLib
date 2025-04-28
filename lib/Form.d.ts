declare namespace myLib {
    class Form extends Element.HTML.Form { //////////////////////////////////////////////////////////////////////////////////// Form ///
        constructor(target?: HTMLFormElement, className?: string, id?: string);
        constructor(className?: string, id?: string);

        // Properties
        elements: Map<HTMLElement>;
        inputs: Map<HTMLInputElement>;
        tabs: List<HTMLInputElement>;

        // Events
        onChange(): void;

        // Methods
        focus(): this;
    } interface Form extends Touch {
        constructor: Form;

        // Listeners
        onFocus(target?: EventTarget): void;
        onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
    }

    namespace Form {
        class Button extends Element.HTML.Input { /////////////////////////////////////////////////////////////////////// Button ///
            constructor(target?: HTMLInputElement, className?: string, id?: string);
            constructor(className?: string, id?: string);
        } interface Button extends Touch {
            constructor: Button

            // Listeners
            onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
            onTap(target?: HTMLElement): boolean | void;

            // Listeners
            onAnimationStart(name?: string): boolean | void;
            onAnimationFrame(dt?: number, f?: number, name?: string): boolean | void;
            onAnimationEnd(name?: string): void;
            onAnimationBreak(name?: string): void;
        }

        class Checkbox extends Element.HTML.Input { /////////////////////////////////////////////////////////////////// Checkbox ///
            constructor(target?: HTMLInputElement, className?: string, id?: string);
            constructor(className?: string, id?: string);

            // Events
            onChange(chacked: boolean): void;

            // Accessors
            get disabled(): boolean;
            set disabled(value: boolean);

            // Methods
            change(): this;
            check(): this;
            disable(): this;
            set(checked: boolean): this;
            uncheck(): this;
        } interface Checkbox extends Touch {
            constructor: Checkbox;

            // Listeners
            onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
            onTap(target?: HTMLElement): boolean | void;
        }

        class ListBox extends Element.HTML.Input { ///////////////////////////////////////////////////////////////////// ListBox ///
            constructor(columns: { title: string, filter?: string }, src: string,
                target?: HTMLInputElement, className?: string, id?: string);

            constructor(columns: { title: string, filter?: string }, src: string,
                className?: string, id?: string);

            // Properties
            data: string[];
            list: ListBox.List;

            // Events
            onChange(): void;

            // Methods
            set(data: string[]): this;
        } interface ListBox extends Touch {
            constructor: ListBox;

            // Listeners
            onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
            onTap(target?: HTMLElement): boolean | void;
        }

        namespace ListBox {
            class List extends Layer { //////////////////////////////////////////////////////////////////////////////// List ///
                constructor(columns: { title: string, filter?: string }, src: string);

                // Properties
                table: Table;

                // Listeners
                onResize(capture?: boolean): boolean | void;
                onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
                onTap(target?: HTMLElement): boolean | void;

                // Methods
                setFilter(filter: string): this;
            } interface List {
                constructor: List;
            }
        }

        class Mail extends Element.HTML.Input { /////////////////////////////////////////////////////////////////////////// Mail ///
            constructor(target?: HTMLInputElement, className?: string, id?: string);
            constructor(className?: string, id?: string);

            // Events
            onChange(match: boolean): void;
            onInput(value: string): string;
            onSubmit(): void;

            // Methods
            set(value: string): this;
        } interface Mail extends Touch {
            constructor: Mail;

            // Listeners
            onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
            onTap(target?: HTMLElement): boolean | void;
        }

        class Password extends Element.HTML.Input { /////////////////////////////////////////////////////////////////// Password ///
            constructor(target?: HTMLInputElement, className?: string, id?: string);
            constructor(className?: string, id?: string);

            // Events
            onChange(value: string): void;
            onInput(value: string): string;
            onSubmit(): void;

            // Methods
            set(value: string): this;
        } interface Password extends Touch {
            constructor: Password;

            // Listeners
            onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
            onTap(target?: HTMLElement): boolean | void;
        }

        class Phone extends Element.HTML.Input { ///////////////////////////////////////////////////////////////////////// Phone ///
            constructor(target?: HTMLInputElement, className?: string, id?: string);
            constructor(className?: string, id?: string);

            // Properties
            format: {
                indexEnd: number[]
                indexStart: number[]
                selectionEnd: number[]
                selectionStart: number[]
            };

            index: number;
            indexSelection: string;
            phone: string[];

            // Events
            onChange(match: boolean | void): void;
            onSubmit(): void;

            // Methods
            set(value: string): this;
        } interface Phone extends Touch {
            constructor: Phone;

            // Listeners
            onBlur(target?: EventTarget): void;
            onFocus(target?: EventTarget): void;
            onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
            onTap(target?: HTMLElement): boolean | void;
        }

        class Text extends Element.HTML.Input { /////////////////////////////////////////////////////////////////////////// Text ///
            constructor(target?: HTMLInputElement, className?: string, id?: string);
            constructor(className?: string, id?: string);

            // Events
            onChange(value: string): void;
            onInput(value: string): string;
            onSubmit(): void;

            // Methods
            set(value: string): this;
        } interface Text extends Touch {
            constructor: Text;

            // Listeners
            onKeyDown(code?: string, key?: string, modifiers?: Touch.Modifiers): boolean | void;
            onTap(target?: HTMLElement): boolean | void;
        }
    }
}