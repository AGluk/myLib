declare namespace myLib {
    class Logo extends Element.HTML.Image { /////////////////////////////////////////////////////////////////////////////////// Logo ///
        constructor(src: string, className?: string, id?: string);

        // Methods
        setSize(size: number): this;
    } interface Logo {
        constructor: typeof Logo;
    }
}