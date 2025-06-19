// #include <./Element.js>
// #include <./List.js>
// #include <./Map.js>
// #include <./Touch.js>

'use strict';

myLib.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// FormHandler ///
    /** @this {myLib.FormHandler} */
    function FormHandler(...args) {
        this.extends(myLib.Element.HTML.Form, args)
            .mixin(myLib.Touch);

        // Initialization

        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('inputs', new myLib.Map());
        this.defineProperty('tabs', new myLib.List());

        this.iterateDOM(child => {
            if (child.nodeName === 'INPUT') {
                if (child.hasAttribute('name'))
                    this.inputs[child.getAttribute('name')] = child;

                if (child.hasAttribute('tabindex'))
                    this.tabs.add(child, Number(child.getAttribute('tabindex')));

                return false;
            } else {
                if (child.hasAttribute('id')) {
                    this.elements[child.getAttribute('id')] = child;
                } else if (child.hasAttribute('data-id')) {
                    this.elements[child.getAttribute('data-id')] = child;
                }

                if (child.hasAttribute('tabindex'))
                    this.tabs.add(child, Number(child.getAttribute('tabindex')));

                return true;
            }
        });

        this.tabs.loop().current = this.tabs.first;
    },

    // Static
    {
        className: 'my-form'
    },

    // Extends
    myLib.Element.HTML.Form,
    {
        /** @this {myLib.FormHandler.prototype} */
        focus() {
            this.tabs.current.target.focus();
            return this;
        }
    },

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.FormHandler.prototype} */
        onFocus(target) {
            if ((this.tabs.current !== null) && (target.hasAttribute('tabindex'))) {
                let index = Number(target.getAttribute('tabindex'));
                if (this.tabs.current.index < index) {
                    while (this.tabs.current.target !== target)
                        this.tabs.current = this.tabs.current.next;
                } else if (this.tabs.current.index > index) {
                    while (this.tabs.current.target !== target)
                        this.tabs.current = this.tabs.current.prev;
                }
            }

            return true;
        },

        /** @this {myLib.FormHandler.prototype} */
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

myLib.FormHandler.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Button ///
    /** @this {myLib.FormHandler.Button} */
    function Button(...args) {
        this.extends(myLib.Element.HTML.Input, args)
            .mixin(myLib.Touch);

        this.type = 'button';
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.FormHandler.Button.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    this.onTap(this.target);
                    return true;
            }
        },

        /** @this {myLib.FormHandler.Button.prototype} */
        onTap() {
            if (!this.disabled)
                return true;
        }
    }
);

myLib.FormHandler.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////// Checkbox ///
    /** @this {myLib.FormHandler.Checkbox} */
    function Checkbox(...args) {
        this.extends(myLib.Element.HTML.Input, args)
            .mixin(myLib.Touch);

        this.type = 'checkbox';
    },

    // Extends
    myLib.Element.HTML.Input,
    {
        disabled: {
            /** @this {myLib.FormHandler.Checkbox.prototype} */
            get() {
                return this.target.disabled;
            },

            /** @this {myLib.FormHandler.Checkbox.prototype} */
            set(disabled) {
                this.target.disabled = disabled;
                if (disabled)
                    this.checked = false;
            }
        },

        /** @this {myLib.FormHandler.Checkbox.prototype} */
        disable() {
            this.target.disabled = true;
            this.checked = false;
            return this;
        }
    },

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.FormHandler.Checkbox.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Space':
                    this.change();
                    return true;
            }
        },

        /** @this {myLib.FormHandler.Checkbox.prototype} */
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
        /** @this {myLib.FormHandler.Checkbox.prototype} */
        change() {
            this.checked = !this.checked;
            this.onChange(this.checked);

            return this;
        },

        /** @this {myLib.FormHandler.Checkbox.prototype} */
        check() {
            if (this.checked === false) {
                this.checked = true;
                this.onChange(true);
            }

            return this;
        },

        /** @this {myLib.FormHandler.Checkbox.prototype} */
        set(checked) {
            if (this.checked !== checked) {
                this.checked = checked;
                this.onChange(checked);
            }

            return this;
        },

        /** @this {myLib.FormHandler.Checkbox.prototype} */
        uncheck() {
            if (this.checked === true) {
                this.checked = false;
                this.onChange(false);
            }

            return this;
        }
    }
);

myLib.FormHandler.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Mail ///
    /** @this {myLib.FormHandler.Mail} */
    function Mail(...args) {
        this.extends(myLib.Element.HTML.Input, args)
            .mixin(myLib.Touch);

        this.type = 'text';

        // Initialization

        this.addEventListener('input', () => {
            this.value = this.onInput(this.value);

            if (/^[0-9a-zа-я]+[0-9a-zа-я_.\-]*@[0-9a-zа-я]+[0-9a-zа-я_.\-]*\.[a-zа-я]{2,}$/i.test(this.value)) {
                this.onChange(true);
            } else {
                this.onChange(false);
            }
        });
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.FormHandler.Mail.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Enter':
                case 'NumpadEnter':
                    return this.onSubmit();
                case 'Escape':
                    if (this.selectionStart !== this.selectionEnd) {
                        this.setSelectionRange(this.selectionEnd, this.selectionEnd);
                        return true;
                    }
                case 'Tab':
                    return;
                default:
                    return false;
            }
        },

        /** @this {myLib.FormHandler.Mail.prototype} */
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
        /** @this {myLib.FormHandler.Mail.prototype} */
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

myLib.FormHandler.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////// Password ///
    /** @this {myLib.FormHandler.Password} */
    function Password(...args) {
        this.extends(myLib.Element.HTML.Input, args)
            .mixin(myLib.Touch);

        this.type = 'password';

        // Initialization

        this.addEventListener('input', () => {
            this.value = this.onInput(this.value);
            this.onChange(this.value);
        });
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.FormHandler.Password.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Enter':
                case 'NumpadEnter':
                    return this.onSubmit();
                case 'Escape':
                    if (this.selectionStart !== this.selectionEnd) {
                        this.setSelectionRange(this.selectionEnd, this.selectionEnd);
                        return true;
                    }
                case 'Tab':
                    return;
                default:
                    return false;
            }
        },

        /** @this {myLib.FormHandler.Password.prototype} */
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
        /** @this {myLib.FormHandler.Password.prototype} */
        set(value) {
            this.value = this.onInput(value.match(/^[ \t]*(.*?)[ \t]*$/)[1]);
            this.onChange(this.value);

            return this;
        }
    }
);

myLib.FormHandler.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Phone ///
    /** @this {myLib.FormHandler.Phone} */
    function Phone(...args) {
        this.extends(myLib.Element.HTML.Input, args)
            .mixin(myLib.Touch);

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
        });

        this.addEventListener('cut', () => {
            this.index = this.format.indexStart[this.selectionStart];
        });

        this.addEventListener('input', () => {
            let phone = this.value.match(/[0-9]/g);
            if (phone !== null) {
                switch (phone[0]) {
                    case '7':
                    case '8':
                        let value = '+7 (***) ***-**-**';

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
        });

        this.addEventListener('paste', () => {
            this.value = '';
        });
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.FormHandler.Phone.prototype} */
        onBlur() {
            if (this.value === '+')
                this.value = '';
        },

        /** @this {myLib.FormHandler.Phone.prototype} */
        onFocus() {
            this.index = this.format.indexStart[this.selectionStart];

            if (this.value === '')
                this.value = '+';
        },

        /** @this {myLib.FormHandler.Phone.prototype} */
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

        /** @this {myLib.FormHandler.Phone.prototype} */
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
        /** @this {myLib.FormHandler.Phone.prototype} */
        set(value) {
            let phone = value.match(/[0-9]/g);
            if (phone !== null) {
                switch (phone[0]) {
                    case '7':
                    case '8':
                        let value = '+7 (***) ***-**-**';

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

myLib.FormHandler.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Text ///
    /** @this {myLib.FormHandler.Text} */
    function Text(...args) {
        this.extends(myLib.Element.HTML.Input, args)
            .mixin(myLib.Touch);

        this.type = 'text';

        // Initialization

        this.addEventListener('input', () => {
            this.value = this.onInput(this.value);
            this.onChange(this.value);
        });
    },

    // Extends
    myLib.Element.HTML.Input,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.FormHandler.Text.prototype} */
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
                    }
                case 'Tab':
                    return;
                default:
                    return false;
            }
        },

        /** @this {myLib.FormHandler.Text.prototype} */
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
            return value.replace(/^[ \t]*(.*)$/, '1$').replace(/[ \t]+/g, ' ').replace(/[^0-9a-zа-я_,.;:'"~!?@#№$%^&*( )=/+-]/ig, '');
        }
    },

    // Methods
    {
        /** @this {myLib.FormHandler.Text.prototype} */
        set(value) {
            this.value = this.onInput(value.match(/^[ \t]*(.*?)[ \t]*$/)[1]);
            this.onChange(this.value);
        }
    }
);