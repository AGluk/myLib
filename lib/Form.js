// #include <./Element.js>
// #include <./List.js>
// #include <./Map.js>
// #include <./Touch.js>

'use strict';

myLib.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Form ///
    /** @this {myLib.Form} */
    function Form(...args) {
        myLib.Element.HTML.Form.apply(this, args);
        myLib.Touch.call(this);

        // Initialization

        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('inputs', new myLib.Map());
        this.defineProperty('tabs', new myLib.List());

        this.iterateDOM(child => {
            if (child.nodeName === 'INPUT') {
                if (child.hasAttribute('name'))
                    this.inputs[child.getAttribute('name')] = child;

                if (child.hasAttribute('tabindex'))
                    this.tabs.add(child, parseInt(child.getAttribute('tabindex'), 10));

                return false;
            } else {
                if (child.hasAttribute('id')) {
                    this.elements[child.getAttribute('id')] = child;
                } else if (child.hasAttribute('data-id')) {
                    this.elements[child.getAttribute('data-id')] = child;
                }

                if (child.hasAttribute('tabindex'))
                    this.tabs.add(child, parseInt(child.getAttribute('tabindex'), 10));

                return true;
            }
        });

        this.tabs.loop().current = this.tabs.first;
    },

    // Extends
    myLib.Element.HTML.Form,
    {
        /** @this {myLib.Form.prototype} */
        focus() {
            this.tabs.current.target.focus();
            return this;
        }
    },

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Form.prototype} */
        onFocus(target) {
            if ((this.tabs.current !== null) && (target.hasAttribute('tabindex'))) {
                let index = parseInt(target.getAttribute('tabindex'), 10);
                if (this.tabs.current.index < index) {
                    while (this.tabs.current.target !== target)
                        this.tabs.current = this.tabs.current.next;
                } else if (this.tabs.current.index > index) {
                    while (this.tabs.current.target !== target)
                        this.tabs.current = this.tabs.current.prev;
                }
            }
        },

        /** @this {myLib.Form.prototype} */
        onKeyDown(code, key, modifiers) {
            switch (code) {
                case 'Enter':
                case 'NumpadEnter':
                case 'Tab':
                    if (modifiers.shift) {
                        do {
                            this.tabs.current = this.tabs.current.prev;
                        } while (this.tabs.current.target.disabled);
                    } else {
                        do {
                            this.tabs.current = this.tabs.current.next;
                        } while (this.tabs.current.target.disabled);
                    }

                    this.tabs.current.target.focus({ preventScroll: true });
                    return true;
            }
        }
    },

    // Events
    {
        onChange() { }
    }
);

myLib.Form.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// Button ///
    /** @this {myLib.Form.Button} */
    function Button(...args) {
        myLib.Element.HTML.Input.apply(this, args);
        myLib.Touch.call(this);

        this.type = 'button';
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Form.Button.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    this.onTap(this.target);
                    return true;
            }
        },

        /** @this {myLib.Form.Button.prototype} */
        onTap() {
            if (!this.disabled)
                return true;
        }
    }
);

myLib.Form.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////// Checkbox ///
    /** @this {myLib.Form.Checkbox} */
    function Checkbox(...args) {
        myLib.Element.HTML.Input.apply(this, args);
        myLib.Touch.call(this);

        this.type = 'checkbox';
    },

    // Extends
    myLib.Element.HTML.Input,
    {
        disabled: {
            /** @this {myLib.Form.Checkbox.prototype} */
            get() {
                return this.target.disabled;
            },

            /** @this {myLib.Form.Checkbox.prototype} */
            set(disabled) {
                this.target.disabled = disabled;
                if (disabled)
                    this.checked = false;
            }
        },

        /** @this {myLib.Form.Checkbox.prototype} */
        disable() {
            this.target.disabled = true;
            this.checked = false;
            return this;
        }
    },

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Form.Checkbox.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Space':
                    this.change();
                    return true;
            }
        },

        /** @this {myLib.Form.Checkbox.prototype} */
        onTap() {
            if (!this.disabled) {
                this.change();
                return true;
            }
        }
    },

    // Events
    {
        onChange(checked) { }
    },

    // Methods
    {
        /** @this {myLib.Form.Checkbox.prototype} */
        change() {
            this.checked = !this.checked;
            this.onChange(this.checked);

            return this;
        },

        /** @this {myLib.Form.Checkbox.prototype} */
        check() {
            if (this.checked === false) {
                this.checked = true;
                this.onChange(true);
            }

            return this;
        },

        /** @this {myLib.Form.Checkbox.prototype} */
        set(checked) {
            if (this.checked !== checked) {
                this.checked = checked;
                this.onChange(checked);
            }

            return this;
        },

        /** @this {myLib.Form.Checkbox.prototype} */
        uncheck() {
            if (this.checked === true) {
                this.checked = false;
                this.onChange(false);
            }

            return this;
        }
    }
);

myLib.Form.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Mail ///
    /** @this {myLib.Form.Mail} */
    function Mail(...args) {
        myLib.Element.HTML.Input.apply(this, args);
        myLib.Touch.call(this);

        this.type = 'text';

        // Initialization

        this.addEventListener('input', () => {
            this.value = this.onInput(this.value);

            if (/^[0-9a-zа-я]+[0-9a-zа-я_.\-]*@[0-9a-zа-я]+[0-9a-zа-я_.\-]*\.[a-zа-я]{2,}$/i.test(this.value)) {
                this.onChange(true);
            } else {
                this.onChange(false);
            }
        }, { capture: false, passive: true });
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Form.Mail.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Enter':
                case 'NumpadEnter':
                    return this.onSubmit();
                case 'Escape':
                    if (this.selectionStart !== this.selectionEnd) {
                        this.setSelectionRange(this.selectionEnd, this.selectionEnd);
                        return true;
                    } else {
                        return false;
                    }
                case 'Tab':
                    return;
                default:
                    return false;
            }
        },

        /** @this {myLib.Form.Mail.prototype} */
        onTap() {
            if (!this.disabled)
                return true;
        }
    },

    // Events
    {
        onChange(match) { },
        onSubmit() { },
        onInput(value) {
            return value.replace(/[^0-9a-zа-я_.@\-]/ig, '').toLowerCase();
        }
    },

    // Methods
    {
        /** @this {myLib.Form.Mail.prototype} */
        set(value) {
            this.value = this.onInput(value.match(/^[ \t]*(.*?)[ \t]*$/)[1]);

            if (/^[0-9a-zа-я]+[0-9a-zа-я_.\-]*@[0-9a-zа-я]+[0-9a-zа-я_.\-]*\.[a-zа-я]{2,}$/i.test(this.value)) {
                this.onChange(true);
            } else {
                this.onChange(false);
            }

            return this;
        }
    }
);

myLib.Form.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////// Password ///
    /** @this {myLib.Form.Password} */
    function Password(...args) {
        myLib.Element.HTML.Input.apply(this, args);
        myLib.Touch.call(this);

        this.type = 'password';

        // Initialization

        this.addEventListener('input', () => {
            this.value = this.onInput(this.value);
            this.onChange(this.value);
        }, { capture: false, passive: true });
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Form.Password.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Enter':
                case 'NumpadEnter':
                    return this.onSubmit();
                case 'Escape':
                    if (this.selectionStart !== this.selectionEnd) {
                        this.setSelectionRange(this.selectionEnd, this.selectionEnd);
                        return true;
                    } else {
                        return false;
                    }
                case 'Tab':
                    return;
                default:
                    return false;
            }
        },

        /** @this {myLib.Form.Password.prototype} */
        onTap() {
            if (!this.disabled)
                return true;
        }
    },

    // Events
    {
        onChange() { },
        onSubmit() { },
        onInput(value) {
            return value.replace(/[ \t]/g, '');
        }
    },

    // Methods
    {
        /** @this {myLib.Form.Password.prototype} */
        set(value) {
            this.value = this.onInput(value.match(/^[ \t]*(.*?)[ \t]*$/)[1]);
            this.onChange(this.value);

            return this;
        }
    }
);

myLib.Form.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////// Phone ///
    /** @this {myLib.Form.Phone} */
    function Phone(target) {
        myLib.Element.call(this, target);
        myLib.Touch.call(this);

        this.type = 'text';
        this.autocomplete = 'off';

        // Initialization

        this.defineProperty('format', {
            indexEnd: [-1, -1],
            indexStart: [0, 0],
            selectionEnd: [1],
            selectionStart: [1]
        });

        this.defineProperty('index', 0);
        this.defineProperty('indexSelection', 'start');
        this.defineProperty('phone', []);

        this.addEventListener('copy', () => {
            this.index = this.format.indexStart[this.selectionStart];
        }, { capture: false, passive: true });

        this.addEventListener('cut', () => {
            this.index = this.format.indexStart[this.selectionStart];
        }, { capture: false, passive: true });

        this.addEventListener('input', () => {
            let phone = this.value.match(/[0-9]/g);
            if (phone !== null) {
                switch (phone[0]) {
                    case '7':
                    case '8':
                        let value = '+7\u0020(///)\u0020///-**-**';

                        for (let i = 1; i < 11; i++) {
                            if (i < phone.length) {
                                value = value.replace('*', phone[i]);
                            } else {
                                value = value.replace('*', '_');
                            }
                        }

                        this.index += phone.length - this.phone.length;
                        if (this.index > 11) this.index = 11;
                        this.phone = phone.slice(0, 11);

                        this.value = value;
                        this.format.selectionEnd = new Array(12);
                        this.format.selectionStart = new Array(12);

                        break;
                    default:
                        this.index += phone.length - this.phone.length;
                        this.phone = phone.slice(0, 255);

                        this.value = '+' + this.phone.join('');
                        this.format.selectionEnd = new Array(phone.length + 1);
                        this.format.selectionStart = new Array(phone.length + 1);

                        break;
                }

                this.format.indexEnd = new Array(this.value.length + 1);
                this.format.indexStart = new Array(this.value.length + 1);

                let i = 0, j = 0;
                while ((i < this.format.indexEnd.length) && (i < this.format.indexStart.length)) {
                    this.format.indexEnd[i] = j - 1;
                    this.format.indexStart[i] = j;

                    if (/[0-9]/.test(this.value.charAt(i))) {
                        this.format.selectionEnd[j] = i + 1;
                        this.format.selectionStart[j] = i;
                        j++;
                    } else if (/_/.test(this.value.charAt(i))) {
                        for (let k = i + 1; (k < this.format.indexEnd.length) && (k < this.format.indexStart.length); k++) {
                            this.format.indexEnd[k] = j - 1;
                            this.format.indexStart[k] = j;
                        }

                        i++;
                        break;
                    }

                    i++;
                }

                while ((j < this.format.selectionEnd.length) && (j < this.format.selectionStart.length)) {
                    this.format.selectionEnd[j] = i - 1;
                    this.format.selectionStart[j] = i - 1;

                    j++;
                }

                switch (this.indexSelection) {
                    case 'end':
                        this.setSelectionRange(this.format.selectionEnd[this.index], this.format.selectionEnd[this.index]);
                        break;
                    case 'start':
                        this.setSelectionRange(this.format.selectionStart[this.index], this.format.selectionStart[this.index]);
                        break;
                }
            } else {
                this.value = '+';
                this.phone = [];
                this.index = 0;

                this.format.indexEnd = [-1, -1];
                this.format.indexStart = [0, 0];
                this.format.selectionEnd = [1];
                this.format.selectionStart = [1];
            }

            if (this.phone.length > 0) {
                switch (this.phone[0]) {
                    case '7':
                    case '8':
                        if (this.phone.length === 11) {
                            this.onChange(true);
                        } else {
                            this.onChange(false);
                        }

                        break;
                    default:
                        if (this.phone.length > 1) {
                            this.onChange(true);
                        } else {
                            this.onChange(false);
                        }

                        break;
                }
            } else {
                this.onChange(undefined);
            }
        }, { capture: false, passive: true });

        this.addEventListener('paste', () => {
            this.value = '';
        }, { capture: false, passive: true });
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Form.Phone.prototype} */
        onBlur() {
            if (this.value === '+')
                this.value = '';
        },

        /** @this {myLib.Form.Phone.prototype} */
        onFocus() {
            this.index = this.format.indexStart[this.selectionStart];

            if (this.value === '')
                this.value = '+';
        },

        /** @this {myLib.Form.Phone.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Backspace':
                    if (this.selectionStart === this.selectionEnd) {
                        this.index = this.format.indexEnd[this.selectionStart];
                    } else {
                        this.index = this.format.indexStart[this.selectionStart]
                            + this.format.indexEnd[this.selectionEnd]
                            - this.format.indexStart[this.selectionStart];
                    }

                    this.indexSelection = 'end';
                    return true;
                case 'Delete':
                    if (this.selectionStart === this.selectionEnd) {
                        this.index = this.format.indexStart[this.selectionStart]
                            + this.format.indexStart[this.selectionStart + 1]
                            - this.format.indexStart[this.selectionStart];
                    } else {
                        this.index = this.format.indexStart[this.selectionStart]
                            + this.format.indexStart[this.selectionEnd]
                            - this.format.indexStart[this.selectionStart];
                    }

                    this.indexSelection = 'start';
                    return true;
                case 'Enter':
                case 'NumpadEnter':
                    return this.onSubmit();
                case 'Escape':
                    if (this.selectionStart !== this.selectionEnd) {
                        this.setSelectionRange(this.selectionEnd, this.selectionEnd);
                        return true;
                    } else {
                        return false;
                    }
                case 'Tab':
                    return;
                default:
                    if (this.selectionStart === this.selectionEnd) {
                        this.index = this.format.indexStart[this.selectionStart];
                    } else {
                        this.index = this.format.indexStart[this.selectionStart]
                            + this.format.indexStart[this.selectionEnd]
                            - this.format.indexStart[this.selectionStart];
                    }

                    this.indexSelection = 'start';
                    return false;
            }
        },

        /** @this {myLib.Form.Phone.prototype} */
        onTap() {
            if (!this.disabled)
                return true;
        }
    },

    // Events
    {
        onChange(match) { },
        onSubmit() { }
    },

    // Methods
    {
        /** @this {myLib.Form.Phone.prototype} */
        set(value) {
            let phone = value.match(/[0-9]/g);
            if (phone !== null) {
                switch (phone[0]) {
                    case '7':
                    case '8':
                        let value = '+7\u0020(///)\u0020///-**-**';

                        for (let i = 1; i < 11; i++) {
                            if (i < phone.length) {
                                value = value.replace('*', phone[i]);
                            } else {
                                value = value.replace('*', '_');
                            }
                        }

                        this.index += phone.length - this.phone.length;
                        if (this.index > 11) this.index = 11;
                        this.phone = phone.slice(0, 11);

                        this.value = value;
                        this.format.selectionEnd = new Array(12);
                        this.format.selectionStart = new Array(12);

                        break;
                    default:
                        this.index += phone.length - this.phone.length;
                        this.phone = phone.slice(0, 255);

                        this.value = '+' + this.phone.join('');
                        this.format.selectionEnd = new Array(phone.length + 1);
                        this.format.selectionStart = new Array(phone.length + 1);

                        break;
                }

                this.format.indexEnd = new Array(this.value.length + 1);
                this.format.indexStart = new Array(this.value.length + 1);

                let i = 0, j = 0;
                while ((i < this.format.indexEnd.length) && (i < this.format.indexStart.length)) {
                    this.format.indexEnd[i] = j - 1;
                    this.format.indexStart[i] = j;

                    if (/[0-9]/.test(this.value.charAt(i))) {
                        this.format.selectionEnd[j] = i + 1;
                        this.format.selectionStart[j] = i;
                        j++;
                    } else if (/_/.test(this.value.charAt(i))) {
                        for (let k = i + 1; (k < this.format.indexEnd.length) && (k < this.format.indexStart.length); k++) {
                            this.format.indexEnd[k] = j - 1;
                            this.format.indexStart[k] = j;
                        }

                        i++;
                        break;
                    }

                    i++;
                }

                while ((j < this.format.selectionEnd.length) && (j < this.format.selectionStart.length)) {
                    this.format.selectionEnd[j] = i - 1;
                    this.format.selectionStart[j] = i - 1;

                    j++;
                }

                switch (this.indexSelection) {
                    case 'end':
                        this.setSelectionRange(this.format.selectionEnd[this.index], this.format.selectionEnd[this.index]);
                        break;
                    case 'start':
                        this.setSelectionRange(this.format.selectionStart[this.index], this.format.selectionStart[this.index]);
                        break;
                }
            } else {
                this.value = '';
                this.phone = [];
                this.index = 0;

                this.format.indexEnd = [-1, -1];
                this.format.indexStart = [0, 0];
                this.format.selectionEnd = [1];
                this.format.selectionStart = [1];
            }

            if (this.phone.length > 0) {
                switch (this.phone[0]) {
                    case '7':
                    case '8':
                        if (this.phone.length === 11) {
                            this.onChange(true);
                        } else {
                            this.onChange(false);
                        }

                        break;
                    default:
                        if (this.phone.length > 1) {
                            this.onChange(true);
                        } else {
                            this.onChange(false);
                        }

                        break;
                }
            } else {
                this.onChange(undefined);
            }
        }
    }
);

myLib.Form.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Text ///
    /** @this {myLib.Form.Text} */
    function Text(...args) {
        myLib.Element.HTML.Input.apply(this, args);
        myLib.Touch.call(this);

        this.type = 'text';

        // Initialization

        this.addEventListener('input', () => {
            this.value = this.onInput(this.value);
            this.onChange(this.value);
        }, { capture: false, passive: true });
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Form.Text.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Enter':
                case 'NumpadEnter':
                    this.onSubmit();
                    return true;
                case 'Escape':
                    if (this.selectionStart !== this.selectionEnd) {
                        this.setSelectionRange(this.selectionEnd, this.selectionEnd);
                        return true;
                    } else {
                        return false;
                    }
                case 'Tab':
                    return;
                default:
                    return false;
            }
        },

        /** @this {myLib.Form.Text.prototype} */
        onTap() {
            if (!this.disabled)
                return true;
        }
    },

    // Events
    {
        onChange(value) { },
        onSubmit() { },
        onInput(value) {
            return value.replace(/^[ \t]*(.*)$/, '$1').replace(/[ \t]+/g, ' ').replace(/[^0-9a-zа-я_,.;:'"~!?@#№$%^&*( )=/+-]/ig, '');
        }
    },

    // Methods
    {
        /** @this {myLib.Form.Text.prototype} */
        set(value) {
            this.value = this.onInput(value.match(/^[ \t]*(.*?)[ \t]*$/)[1]);
            this.onChange(this.value);
        }
    }
);