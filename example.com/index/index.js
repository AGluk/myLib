// @ts-nocheck
'use strict';

/** @this {myLib.Page} */
myLib.Page.onLoaded = function () {
    this.onResize = function (capture) {
        this.proto('onResize').call(this, capture); // Remember to call prototype method in cases it presented
        if (capture) { // Capture stage
            this.elements['SIZE'].innerHTML = this.clientWidth + " x " + this.clientHeight;
            return true; // Call onResize(false) on bubble stage, needed for prototype method
        } else { // Bubble stage
            // This code will be called on bubble stage, because we've returned 'true' above
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let main_form = new myLib.Form(this.forms['main_form']);

    let dialog = new myLib.Form.Button(main_form.inputs['dialog']); ////////////////////////////////////////////////////////////////////
    dialog.onTap = function () {
        let dialog = new myLib.Dialog("DIALOG"); // Create dialog with ID=DIALOG

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

        dialog.append().setSrc("./dialog"); // Show dialog and setting it source dir
        return true; // Stop propagation
    };

    let error = new myLib.Form.Button(main_form.inputs['error']); //////////////////////////////////////////////////////////////////////
    error.onTap = function () {
        let error = new myLib.Dialog('error'); // Create dialog with class='error'. Class 'warning' is also defined

        error.onTap = function () { // Redefine prototype behaviour
            this.remove(); // Close dialog by tap on any position, not only outside the dialog (prototype behaviour)
            return true; // Stop propagation
        };

        error.append().setContent("Some error message"); // Show dialog and setting it content
        return true; // Stop propagation
    };

    let form = new myLib.Form.Button(main_form.inputs['form']); ////////////////////////////////////////////////////////////////////////
    form.onTap = function () {
        let form = new myLib.Dialog('FORM'); // Create dialog with ID=FORM

        form.append(true).setSrc("./form"); // Show modal dialog (sending 'true' to append) and setting it source dir
        return true; // Stop propagation
    };

    let photo = new myLib.Form.Button(main_form.inputs['photo']); //////////////////////////////////////////////////////////////////////
    photo.onTap = function () {
        new myLib.Photo().append().setSrc("./photo"); // Show photo viewer
        return true; // Stop propagation
    };

    let pano = new myLib.Form.Button(main_form.inputs['pano']); ////////////////////////////////////////////////////////////////////////
    pano.onTap = function () {
        let layer = new myLib.Layer('pano'); // Create layer

        pano = new myLib.myPano("./pano"); // Creating pano and setting path to the source textures
        layer.appendChild(pano); // Append pano to layer

        layer.onResize = function () { // Override 'onResize' method for center pano on the layer
            pano.style.top = (this.clientHeight - pano.offsetHeight) / 2;
            pano.style.left = (this.clientWidth - pano.offsetWidth) / 2;
        };

        layer.onKeyDown = function (code) { // Override 'onKeyDown' method of 'Layer'
            switch (code) {
                case 'Escape':
                    this.remove(); // Hide layer with pano
                    return true; // Stop propagation and prevent default behaviour
                // Return 'false' for stopping propagation but not preventing default behaviour
                // If nothing returned - the next 'onKeyDown' handler will be called in bubble order
            }
        };

        layer.onTap = function () { // Override 'onTap' method of 'Layer'
            this.remove(); // Hide layer with pano
        };

        layer.append(); // Show our layer with pano
        return true; // Stop propagation
    };
};