declare namespace myLib {
    const cookie: {
        [name: number | string]: string;
        [Symbol.iterator](): Generator<string>;
    };
}