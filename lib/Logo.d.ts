declare namespace myLib {
    class Logo extends Element.HTML.Image { /////////////////////////////////////////////////////////////////////////////////// Logo ///
        constructor(src: string);

        // Methods
        setSize(size: number): this;
    } interface Logo {
        constructor: Logo;
    }
}