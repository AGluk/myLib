declare let GET: Record<string, string>;

declare class myLib extends Function { /////////////////////////////////////////////////////////////////////////////////////////// myLib ///
    constructor();

    /**
    * Define class by constructor and prototype.
    *
    * @param constructor - class constructor
    * @param prototype - class prototype
    * @param properties - optional mixins, prototype methods and accessors
    */
    static defineClass(constructor: Function, prototype: Function, ...properties: (Function |
        Record<string | symbol, ((...arguments: any[]) => any) | {
            get?(): any;
            set?(v: any): void;
        } | boolean | number | string>
    )[]): typeof this;

    /**
     * Define abstract class by name and 'myLib' prototype.
     *
     * @param name - class name
     * @param properties - optional static methods and constants
     */
    static defineClass(name: string, ...properties: Record<string | symbol, any>[]): typeof this;

    /**
     * Get prototype property descriptor.
     *
     * @param name - property name
     */
    static proto(name: string, target: any): myLib.StaticPropertyDescriptor;

    /**
     * Define static properties.
     *
     * @param properties - static methods, accessors and variables
     */
    static static(properties: Record<string | symbol, any>, writable?: boolean): typeof this;

    // Methods

    /**
     * Define accessor in the current object.
     *
     * @param name - accessor name
     * @param get - getter
     * @param set - setter
     */
    defineAccessor<T>(name: string, get: () => T, set: (T) => void): void;

    /**
     * Define property in the current object.
     *
     * @param name - property name
     * @param value - property value
     */
    defineProperty<T>(name: string, value: T): T;

    /**
     * Define properties in the current object.
     *
     * @param properties - object properties
     */
    defineProperties<T extends Record<string | symbol, any>>(properties: T): this & T;

    /**
     * Implement class prototype properties in the current object.
     *
     * @param constructor - implemented class constructor
     * @param arguments - optional constructor arguments
     */
    implements<T>(constructor: T, ...arguments: any[]): this & InstanceType<T>;

    /**
     * Get prototype property descriptor.
     *
     * @param name - property name
     */
    proto(name: string): myLib.PropertyDescriptor;
} interface myLib {
    constructor: myLib;
}

declare namespace myLib {
    class Object extends myLib { //////////////////////////////////////////////////////////////////////////////////////////// Object ///
        constructor(properties: Record<string | symbol, any>);
    } interface Object {
        constructor: myLib.Object;
    }

    class PropertyDescriptor extends myLib { //////////////////////////////////////////////////////////////////// PropertyDescriptor ///
        constructor(descriptor: Window.PropertyDescriptor, target: myLib);

        // Methods
        asdasldfkj(): any;
        get(): any;
        set(value: any): void;
        apply(arguments: any): any;
        call(...arguments: any[]): any;
    } interface PropertyDescriptor {
        constructor: PropertyDescriptor;
    }

    class StaticPropertyDescriptor extends myLib { //////////////////////////////////////////////////////// StaticPropertyDescriptor ///
        constructor(descriptor: Window.PropertyDescriptor);

        // Methods
        get(target: myLib): any;
        set(target: myLib, value: any): void;
        apply(target: myLib, arguments: any): any;
        call(target: myLib, ...arguments: any[]): any;
    } interface StaticPropertyDescriptor {
        constructor: StaticPropertyDescriptor;
    }
}

declare interface Window {
    trace: any;
}