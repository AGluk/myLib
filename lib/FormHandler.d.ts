declare namespace myLib {
    class FormHandler extends Element.HTML.Form { ////////////////////////////////////////////////////////////////////////// FormHandler ///
        constructor(target: HTMLFormElement, className?: string, id?: string);

        // Properties
        elements: Map<HTMLElement>;
        inputs: Map<HTMLInputElement>;
        tabs: List<HTMLInputElement>;

        // Events
        onChange(): void;

        // Methods
        focus(): this;
    } interface FormHandler extends Touch {
        constructor: typeof Form;
    }

    namespace FormHandler {
        class Button extends Element.HTML.Input { /////////////////////////////////////////////////////////////////////// Button ///
            constructor(target?: HTMLInputElement, className?: string, id?: string);
            constructor(className?: string, id?: string);
        } interface Button extends Touch {
            constructor: Button
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
            constructor: typeof Checkbox;
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
            constructor: typeof ListBox;
        }

        namespace ListBox {
            class List extends Layer { //////////////////////////////////////////////////////////////////////////////// List ///
                constructor(columns: { title: string, filter?: string }, src: string);

                // Properties
                table: Table;

                // Methods
                setFilter(filter: string): this;
            } interface List {
                constructor: typeof List;
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
            constructor: typeof Mail;
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
            constructor: typeof Password;
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
            constructor: typeof Phone;
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
            constructor: typeof Text;
        }
    }
}