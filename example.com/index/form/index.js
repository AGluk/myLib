// @ts-nocheck
'use strict';

/** @this {myLib.Dialog} */
myLib.dialogs['form'].onLoaded = function () {
    this.onFocus = () => {
        my_field.focus(); // Select 'my_field' on getting focus on dialog
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let form = new myLib.FormHandler(this.forms['my_form']);

    let my_field = new myLib.FormHandler.Text(form.inputs['my_field']); ////////////////////////////////////////////////////////////////

    my_field.onChange = (value) => {
        if (value.length < 5) {
            close.disable(); // Disable 'close' button if inputed less then 5 characters
        } else {
            close.enable(); // Enable otherwise
        }
    };

    my_field.onInput = (value) => {
        return value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5); // Up to 5 letters and numbers can be inputed
    };

    my_field.onSubmit = () => { // This function called when you press 'Enter' while are in input field
        !close.disabled && close.onTap();
    };

    let close = new myLib.FormHandler.Button(form.inputs['close']); ////////////////////////////////////////////////////////////////////

    close.onTap = () => {
        // Put form processing code here, for example...

        myLib.cookie['my_field'] = my_field.value; // Saving my_field value in Cookies

        // Sending my_field value to the Server
        myLib.AJAX.get(`./form_submit.php?my_field=${my_field.value}`, AJAX => {
            if (AJAX.responseText === '') {
                this.remove(); // Close dialog
            } else {
                new myLib.Dialog('my-dialog-warning').append().setContent("Input '12345' to close dialog"); // Show warning
            }
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    my_field.focus(); // Select 'my_field' on dialog loaded
};