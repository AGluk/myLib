// @ts-nocheck
'use strict';

/** @this {myLib.Dialog} */
myLib.Dialog.onLoaded = function () {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let form = new myLib.Form(this.forms['my_form']);

    let my_field = new myLib.Form.Text(form.inputs['my_field']); ///////////////////////////////////////////////////////////////////

    my_field.onChange = value => {
        if (value.length < 5) {
            close.disable();
        } else {
            close.enable();
        }
    };

    my_field.onInput = function (value) { // Input processing
        return value.substring(0, 5); // Max 20 characters
    };

    my_field.onSubmit = function () { // This function called when you press 'Enter' while are in input field
        close.onTap();
    };

    let close = new myLib.Form.Button(form.inputs['close']); ///////////////////////////////////////////////////////////////////////

    close.onTap = () => {
        if (!close.disabled) {
            // Put form processing code here, for example...

            myLib.cookie['my_field'] = my_field.value; // Saving my_field value in Cookies

            // Sending my_field value to the Server
            myLib.AJAX.get(`./form_submit.php?my_field=${my_field.value}`, AJAX => {
                if (AJAX.responseText === "") {
                    this.remove(); // Close dialog
                } else {
                    new myLib.Dialog('warning').append().setContent("Input '12345' to close dialog"); // Show warning
                }
            });
        }
    };
};