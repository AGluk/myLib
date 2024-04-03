declare namespace myLib {
    class List<T> extends myLib { ///////////////////////////////////////////////////////////////////////////////////////////// List ///
        constructor(array?: T[]);

        // Properties
        current: List.Node<T> | null;
        first: List.Node<T> | null;
        last: List.Node<T> | null;
        length: number;

        // Accessors
        [Symbol.iterator](): Generator<T>;

        // Methods
        add(target: T, index?: number): this;
        break(): this;
        clear(): this;
        insertAfter(target: T, ref_target: T): boolean;
        insertBefore(target: T, ref_target: T): boolean;
        loop(): this;
        pop(target?: T): T | null;
        push(target: T, index?: number): this;
        remove(target?: T): T | null;
        removeNode(node?: List.Node<T>): T | null;
        replace(target: T, ref_target: T): boolean;
    } interface List<T> {
        constructor: List<T>;
    }

    namespace List {
        class Node<T> extends myLib { ///////////////////////////////////////////////////////////////////////////////////// Node ///
            constructor(target: T, index: number, prev: Node<T> | null, next: Node<T> | null);

            // Properties
            target: T;
            index: number;

            prev: Node<T> | null;
            next: Node<T> | null;
        } interface Node<T> {
            constructor: Node<T>;
        }
    }
}