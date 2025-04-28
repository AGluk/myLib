declare namespace myLib {
    abstract class Animation extends myLib { ///////////////////////////////////////////////////////////////////////////// Animation ///
        constructor();

        // Properties
        static soft(f: number): number;
        static softIn(f: number): number;
        static softOut(f: number): number;
        static straight(f: number): number;

        // Events
        onAnimationStart(name?: string): boolean | void;
        onAnimationFrame(dt?: number, f?: number, name?: string): boolean | void;
        onAnimationEnd(name?: string): void;
        onAnimationBreak(name?: string): void; // call 'onAnimationEnd' by default

        // Methods
        animationBreak(...name: string[]): this;
        animationStart(name?: string, duration?: number, curve?: (f: number) => number): this;
        requestAnimationFrame(): this;
    } interface Animation {
        constructor: Animation;
    }

    namespace Animation {
        class Array extends myLib { ////////////////////////////////////////////////////////////////////////////////////// Array ///
            constructor(value: number[]);

            // Properties
            animated: boolean;

            value: number[];
            value_0: number[];
            value_1: number[];

            // Methods
            animate(value: number[]): this;
            set(value: number[]): this;

            onAnimationStart(): void;
            onAnimationFrame(f: number): number[];
            onAnimationFrame_0(f: number): number[];
            onAnimationFrame_1(f: number): number[];
            onAnimationEnd(): void;
            onAnimationBreak(): void;
        } interface Array {
            constructor: Array;
        }

        class Property extends myLib { //////////////////////////////////////////////////////////////////////////////// Property ///
            constructor(value: number)

            // Properties
            animated: boolean;

            value: number;
            value_0: number;
            value_1: number;

            // Methods
            animate(value: number): this;
            set(value: number): this;

            onAnimationStart(): void;
            onAnimationFrame(f: number): number;
            onAnimationFrame_0(f: number): number;
            onAnimationFrame_1(f: number): number;
            onAnimationEnd(): void;
            onAnimationBreak(): void;
        } interface Property {
            constructor: Property;
        }
    }
}