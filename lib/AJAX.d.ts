declare namespace myLib {
    abstract class AJAX extends myLib { /////////////////////////////////////////////////////////////////////////////////////// AJAX ///
        static get(url: string, onLoaded: (AJAX: XMLHttpRequest) => void): XMLHttpRequest;
        static post(url: string, onLoaded: (AJAX: XMLHttpRequest) => void, data = ""): XMLHttpRequest;
    }
}