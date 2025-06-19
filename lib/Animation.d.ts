declare namespace myLib {
    abstract class Animation extends myLib { ///////////////////////////////////////////////////////////////////////////// Animation ///
        constructor();

        // Static
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
        animate(...pairs: ([Animation.Property, number] | [Animation.Array, number[]])[]): boolean;
        animationBreak(...name: string[]): this;
        animationStart(name?: string, duration?: number, curve?: (f: number) => number): this;
        animationStart(duration?: number, curve?: (f: number) => number): this;
        requestAnimationFrame(): this;
    } interface Animation {
        constructor: typeof Animation;
    }

    namespace Animation {
        class Array<N extends number> extends myLib { //////////////////////////////////////////////////////////////////// Array ///
            constructor(value: [number, ...number[]] & { length: N });

            // Properties
            value: number[] & { length: N };
            value_0: number[] & { length: N };
            value_1: number[] & { length: N };

            // Methods
            animate(value: number[] & { length: N }): this;
            set(value: number[] & { length: N }): this;

            onAnimationStart(): void;
            onAnimationFrame(f: number): number[] & { length: N };
            onAnimationEnd(): void;
            onAnimationBreak(): void;
        } interface Array {
            constructor: typeof Array;
        }

        class Property extends myLib { //////////////////////////////////////////////////////////////////////////////// Property ///
            constructor(value: number)

            // Properties
            value: number;
            value_0: number;
            value_1: number;

            // Methods
            animate(value: number): this;
            set(value: number): this;

            onAnimationStart(): void;
            onAnimationFrame(f: number): number;
            onAnimationEnd(): void;
            onAnimationBreak(): void;
        } interface Property {
            constructor: typeof Property;
        }
    }
}