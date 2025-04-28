declare namespace myLib {
    class Map<T> extends myLib { /////////////////////////////////////////////////////////////////////////////////////////////// Map ///
        constructor();

        // Properties
        target: Record<string | symbol, any>;

        // Accessors
        [id: number | string | symbol]: T;
        [Symbol.iterator](): Generator<T>;
    } interface Map<T> {
        constructor: Map<T>
    }
}