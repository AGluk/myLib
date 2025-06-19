// @ts-nocheck
'use strict';

/** @this {myLib.Page} */
myLib.Page.onLoaded = function () {
    this.onResize = function (capture) {
        this.proto('onResize').call(this, capture); // Remember to call prototype method in cases it presented
        if (capture) { // Capture stage
            this.elements['SIZE'].innerHTML = `${this.clientWidth} x ${this.clientHeight}`;
            return true; // Call onResize(false) on bubble stage, needed for prototype method
        } else { // Bubble stage
            // This code will be called on bubble stage, because we've returned 'true' above
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let main_form = new myLib.FormHandler(this.forms['main_form']);

    let dialog = new myLib.FormHandler.Button(main_form.inputs['dialog']); /////////////////////////////////////////////////////////////
    dialog.onTap = function () {
        let dialog = new myLib.Dialog('my-dialog-sample'); // Create dialog with ID=DIALOG

        dialog.onRemove = function () {
            // This code will be executed just before dialog closed
        };

        dialog.frame.head.onTap = function (target) {
            // This code will be executed on dialog head tap

            return this.proto('onTap').call(); // Call default behaviour - scroll to left: 0, top: 0
        };

        dialog.frame.body.onTap = function (target) {
            // This code will be executed on dialog body tap
        };

        dialog.append().setSrc('./dialog'); // Show dialog and setting it source dir
        return true; // Stop propagation
    };

    let error = new myLib.FormHandler.Button(main_form.inputs['error']); ///////////////////////////////////////////////////////////////
    error.onTap = function () {
        let error = new myLib.Dialog('my-dialog-error'); // Create dialog with class='error'. Class 'warning' is also defined

        error.onTap = function () { // Redefine prototype behaviour
            this.remove(); // Close dialog by tap on any position, not only outside the dialog (prototype behaviour)
            return true; // Stop propagation
        };

        error.append().setContent("Some error message"); // Show dialog and setting it content
        return true; // Stop propagation
    };

    let form = new myLib.FormHandler.Button(main_form.inputs['form']); /////////////////////////////////////////////////////////////////
    form.onTap = function () {
        myLib.dialogs['form'] = new myLib.Dialog('my-dialog-form'); // Create dialog with ID=FORM
        myLib.dialogs['form'].append().modal(true).setSrc('./form'); // Show modal dialog (sending 'true' to append) and setting it's source dir

        return true; // Stop propagation
    };

    let photo = new myLib.FormHandler.Button(main_form.inputs['photo']); ///////////////////////////////////////////////////////////////
    photo.onTap = function () {
        new myLib.Photo().append().setSrc('./photo'); // Show photo viewer
        return true; // Stop propagation
    };

    let pano = new myLib.FormHandler.Button(main_form.inputs['pano']); /////////////////////////////////////////////////////////////////
    pano.onTap = function () {
        let pano = new myLib.myPano('./pano'); // Create 'myPano' object
        pano.append(); // Append it to default LayersBox
        return true; // Stop propagation
    };
};