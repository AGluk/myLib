// #include <./Animation.js>

'use strict';

{
    /** @type {HTMLDivElement} */
    const cover = document.createElement('div');
    cover.className = 'cover';

    /** @type {number} */
    let capture = 0;

    /** @type {UIEvent.ObjectList | null} */
    let object_list = undefined;

    /** @type {number} */
    let timeout = 0;

    const gizmo =
    /**
     * @type {myLib.Object & {
     *  date: number
     *  date_0: number
     *  count: number
     *  target: Element
     *  clientX: number
     *  clientX_0: number
     *  clientY: number
     *  clientY_0: number
     *  clientR: number
     *  vX: number
     *  vY: number
     * }}
     */(new myLib.Object({
        date: 0,
        date_0: 0,
        count: 0,
        target: null,
        clientX: 0,
        clientX_0: 0,
        clientY: 0,
        clientY_0: 0,
        clientR: 0,
        vX: 0,
        vY: 0
    })).implements(myLib.Animation);

    gizmo.onAnimationStart = () => {
        document.body.appendChild(cover);
    };

    gizmo.onAnimationFrame = (dt) => {
        let dX = gizmo.vX * dt,
            dY = gizmo.vY * dt;

        gizmo.date += dt;

        if (object_list !== null) {
            let top = object_list.top,
                onTouchMove = true;

            while (top !== null) {
                let clientRect = top.target.target.getBoundingClientRect();
                top.target.touch.layerX = gizmo.clientX - clientRect.left;
                top.target.touch.layerY = gizmo.clientY - clientRect.top;

                top.target.touch.vX = gizmo.vX;
                top.target.touch.vY = gizmo.vY;

                if (onTouchMove)
                    onTouchMove = !top.target.onTouchMove(dX, dY, 1);

                top = top.parent;
            }
        }
    };

    gizmo.onAnimationBreak = () => {
        document.body.removeChild(cover);
    };

    document.addEventListener('click', function (event) { //////////////////////////////////////////////////////////////////////////////////
        event.stopPropagation();
        event.preventDefault();

        return false;
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('dblclick', function (event) { ///////////////////////////////////////////////////////////////////////////////
        event.stopPropagation();
        event.preventDefault();

        return false;
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('dragstart', function (event) { //////////////////////////////////////////////////////////////////////////////
        event.stopPropagation();
        event.preventDefault();

        return false;
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('contextmenu', function (event) { ////////////////////////////////////////////////////////////////////////////
        if (!(event.ctrlKey || ((event.target.nodeName === 'INPUT') && (event.target.getAttribute('type') === 'text')))) {
            event.stopPropagation();
            event.preventDefault();
        }

        return false;
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('visibilitychange', function () { ////////////////////////////////////////////////////////////////////////////
        switch (capture) {
            case 4:
            case 3:
                this.dispatchEvent(new TouchEvent('touchend', {
                    'bubbles': true,
                    'touches': []
                }));

                return;
            case 2:
            case 1:
                this.dispatchEvent(new MouseEvent('mouseup', {
                    'bubbles': true
                }));

                return;
        }
    }, {
        capture: false,
        passive: false
    });

    document.addEventListener('mousedown', function (event) { //////////////////////////////////////////////////////////////////////////////
        switch (event.button) {
            case 0:
                switch (capture) {
                    case 2:
                    case 1:
                        this.dispatchEvent(new MouseEvent('mouseup', {
                            'bubbles': true
                        }));
                    case 0:
                        capture = 1;

                        event.gizmo = {
                            date: Date.now(),
                            count: 1,
                            clientX: event.clientX,
                            clientY: event.clientY,
                            clientR: 0
                        };

                        this.addEventListener('mousemove', onMouseMove_true, true);
                        this.addEventListener('mousemove', onMouseMove_1_false, false);
                        return;
                }

                break;
            case 1:
                switch (capture) {
                    case 2:
                        this.dispatchEvent(new MouseEvent('mouseup', {
                            'bubbles': true
                        }));

                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    case 1:
                        this.dispatchEvent(new MouseEvent('mouseup', {
                            'bubbles': true
                        }));
                    case 0:
                        capture = 2;

                        event.gizmo = {
                            date: Date.now(),
                            count: 1,
                            clientX: event.clientX,
                            clientY: event.clientY,
                            clientR: 0
                        };

                        this.addEventListener('mousemove', onMouseMove_true, true);
                        this.addEventListener('mousemove', onMouseMove_2_false, false);

                        gizmo.animationStart();
                        return;
                }

                break;
            case 2:
                switch (capture) {
                    case 2:
                    case 1:
                        this.dispatchEvent(new MouseEvent('mouseup', {
                            'bubbles': true
                        }));
                    case 0:
                        if (event.ctrlKey || ((event.target.nodeName === 'INPUT') && (event.target.getAttribute('type') === 'text'))) {
                            event.stopPropagation();
                        } else {
                            event.gizmo = {
                                date: Date.now(),
                                count: 1,
                                clientX: event.clientX,
                                clientY: event.clientY,
                                clientR: 0
                            };
                        }

                        return;
                }

                break;
        }

        event.stopPropagation();
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('mousedown', function (event) { //////////////////////////////////////////////////////////////////////////////
        gizmo.date_0 = gizmo.date = event.gizmo.date;
        gizmo.target = event.target;

        gizmo.clientX_0 = gizmo.clientX = event.gizmo.clientX;
        gizmo.clientY_0 = gizmo.clientY = event.gizmo.clientY;

        gizmo.vX = 0;
        gizmo.vY = 0;

        if (event.object_list !== undefined) {
            object_list = event.object_list;

            let top = object_list.top,
                onHold = true,
                onTouchEnd = true,
                onTouchStart = true;

            switch (event.button) {
                case 0:
                    while (top !== null) {
                        top.target.touch.count = gizmo.count;

                        let clientRect = top.target.target.getBoundingClientRect();
                        top.target.touch.layerX_0 = top.target.touch.layerX = gizmo.clientX - clientRect.left;
                        top.target.touch.layerY_0 = top.target.touch.layerY = gizmo.clientY - clientRect.top;

                        top.target.touch.vX = 0;
                        top.target.touch.vY = 0;

                        if (onTouchStart)
                            onTouchStart = !top.target.onTouchStart(gizmo.target);

                        top = top.parent;
                    }

                    timeout = setTimeout(() => {
                        timeout = 0;

                        let dX = gizmo.clientX - gizmo.clientX_0,
                            dY = gizmo.clientY - gizmo.clientY_0;

                        if (Math.sqrt(dX * dX + dY * dY) < 10) {
                            top = object_list.top;
                            while ((top !== null) && onHold) {
                                onHold = !top.target.onHold(gizmo.target);
                                top = top.parent;
                            }
                        }
                    }, 500);

                    break;
                case 1:
                    while (top !== null) {
                        top.target.touch.count = gizmo.count;

                        let clientRect = top.target.target.getBoundingClientRect();
                        top.target.touch.layerX_0 = top.target.touch.layerX = gizmo.clientX - clientRect.left;
                        top.target.touch.layerY_0 = top.target.touch.layerY = gizmo.clientY - clientRect.top;

                        top.target.touch.vX = 0;
                        top.target.touch.vY = 0;

                        if (onTouchStart)
                            onTouchStart = !top.target.onTouchStart(gizmo.target);

                        top = top.parent;
                    }

                    break;
                case 2:
                    while (top !== null) {
                        top.target.touch.count = gizmo.count;

                        let clientRect = top.target.target.getBoundingClientRect();
                        top.target.touch.layerX_0 = top.target.touch.layerX = gizmo.clientX - clientRect.left;
                        top.target.touch.layerY_0 = top.target.touch.layerY = gizmo.clientY - clientRect.top;

                        top.target.touch.vX = 0;
                        top.target.touch.vY = 0;

                        if (onTouchStart)
                            onTouchStart = !top.target.onTouchStart(gizmo.target);

                        if (onHold)
                            onHold = !top.target.onHold(gizmo.target);

                        if (onTouchEnd)
                            onTouchEnd = !top.target.onTouchEnd();

                        top = top.parent;
                    }

                    break;
            }
        } else {
            object_list = null;
        }
    }, {
        capture: false,
        passive: true
    });

    document.addEventListener('mouseup', function (event) { ////////////////////////////////////////////////////////////////////////////////
        if (event.view === window) {
            switch (event.button) {
                case 0:
                    switch (capture) {
                        case 1:
                            this.removeEventListener('mousemove', onMouseMove_true, true);
                            this.removeEventListener('mousemove', onMouseMove_1_false, false);

                            event.gizmo = {
                                date: Date.now(),
                                count: 0
                            };

                            return;
                    }

                    break;
                case 1:
                    switch (capture) {
                        case 2:
                            let date = Date.now();
                            if (date - gizmo.date_0 > 300) {
                                this.removeEventListener('mousemove', onMouseMove_true, true);
                                this.removeEventListener('mousemove', onMouseMove_2_false, false);

                                gizmo.animationBreak();

                                event.gizmo = {
                                    date: date,
                                    count: 0
                                };

                                return;
                            }
                    }

                    break;
            }

            event.stopPropagation();
        } else {
            this.removeEventListener('mousemove', onMouseMove_true, true);
            this.removeEventListener('mousemove', onMouseMove_1_false, false);
            this.removeEventListener('mousemove', onMouseMove_2_false, false);

            gizmo.animationBreak();

            event.gizmo = {
                date: Date.now(),
                count: 0
            };
        }
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('mouseup', function (event) { ////////////////////////////////////////////////////////////////////////////////
        switch (capture) {
            case 1:
                if (timeout > 0) {
                    clearTimeout(timeout);
                    timeout = 0;
                }

                if (object_list !== null) {
                    let top = object_list.top,
                        onTouchEnd = true,
                        dX = gizmo.clientX - gizmo.clientX_0,
                        dY = gizmo.clientY - gizmo.clientY_0;

                    if ((event.gizmo.date - gizmo.date_0 < 300) && (Math.sqrt(dX * dX + dY * dY) < 3)) {
                        if ((gizmo.target instanceof HTMLAnchorElement) && (gizmo.target.hasAttribute('href'))) {
                            if (event.ctrlKey || event.metaKey) {
                                window.open(gizmo.target.getAttribute('href'), 'blank_');
                            } else if (gizmo.target.hasAttribute('target')) {
                                window.open(gizmo.target.getAttribute('href'), gizmo.target.getAttribute('target'));
                            } else {
                                location.href = gizmo.target.getAttribute('href');
                            }
                        } else {
                            let onTap = true;

                            while (top !== null) {
                                top.target.touch.count = 0;
                                top.target.touch.vX = 0;
                                top.target.touch.vY = 0;

                                if (onTouchEnd)
                                    onTouchEnd = !top.target.onTouchEnd();

                                if (onTap)
                                    onTap = !top.target.onTap(gizmo.target);

                                top.target.touch.layerX_0 = top.target.touch.layerX = 0;
                                top.target.touch.layerY_0 = top.target.touch.layerY = 0;

                                top = top.parent;
                            }
                        }
                    } else {
                        if (event.gizmo.date - gizmo.date < 100) {
                            while (top !== null) {
                                top.target.touch.count = 0;

                                if (onTouchEnd)
                                    onTouchEnd = !top.target.onTouchEnd();

                                top.target.touch.vX = 0;
                                top.target.touch.vY = 0;

                                top = top.parent;
                            }
                        } else {
                            while (top !== null) {
                                top.target.touch.count = 0;
                                top.target.touch.vX = 0;
                                top.target.touch.vY = 0;

                                if (onTouchEnd)
                                    onTouchEnd = !top.target.onTouchEnd();

                                top = top.parent;
                            }
                        }
                    }
                }

                break;
            case 2:
                if (object_list !== null) {
                    let top = object_list.top,
                        onTouchEnd = true;

                    while (top !== null) {
                        top.target.touch.count = 0;
                        top.target.touch.vX = 0;
                        top.target.touch.vY = 0;

                        if (onTouchEnd)
                            onTouchEnd = !top.target.onTouchEnd();

                        top.target.touch.layerX_0 = top.target.touch.layerX = 0;
                        top.target.touch.layerY_0 = top.target.touch.layerY = 0;

                        top = top.parent;
                    }
                }

                break;
        }

        object_list = undefined;
        capture = 0;
    }, {
        capture: false,
        passive: true
    });

    function onMouseMove_true(event) { /////////////////////////////////////////////////////////////////////////////////////////////////////
        event.gizmo = {
            date: Date.now(),
            count: 1,
            clientX: event.clientX,
            clientY: event.clientY,
            clientR: 0
        };
    }

    function onMouseMove_1_false(event) { //////////////////////////////////////////////////////////////////////////////////////////////////
        let dt = event.gizmo.date - gizmo.date,
            dX = event.gizmo.clientX - gizmo.clientX,
            dY = event.gizmo.clientY - gizmo.clientY;

        if ((dt > 8) && ((dX !== 0) || (dY !== 0))) {
            gizmo.date = event.gizmo.date;
            gizmo.clientX = event.gizmo.clientX;
            gizmo.clientY = event.gizmo.clientY;

            if (object_list !== null) {
                let top = object_list.top,
                    onTouchMove = true;

                while (top !== null) {
                    let clientRect = top.target.target.getBoundingClientRect();
                    top.target.touch.layerX = gizmo.clientX - clientRect.left;
                    top.target.touch.layerY = gizmo.clientY - clientRect.top;

                    top.target.touch.vX = (top.target.touch.vX + dX / dt) / 2;
                    top.target.touch.vY = (top.target.touch.vY + dY / dt) / 2;

                    if (onTouchMove)
                        onTouchMove = !top.target.onTouchMove(dX, dY, 1);

                    top = top.parent;
                }
            }
        }
    }

    function onMouseMove_2_false(event) { //////////////////////////////////////////////////////////////////////////////////////////////////
        gizmo.clientX = event.gizmo.clientX;
        gizmo.clientY = event.gizmo.clientY;

        let dX = gizmo.clientX_0 - gizmo.clientX;
        gizmo.vX = dX / 200;
        if (Math.abs(gizmo.vX) < 0.01) gizmo.vX = 0;

        let dY = gizmo.clientY_0 - gizmo.clientY;
        gizmo.vY = dY / 200;
        if (Math.abs(gizmo.vY) < 0.01) gizmo.vY = 0;
    }

    document.addEventListener('touchstart', function (event) { /////////////////////////////////////////////////////////////////////////////
        if (capture === 0) {
            if ((event.target.nodeName !== 'INPUT') || (event.target.getAttribute('type') !== 'text')) {
                capture = 3;
            } else {
                capture = 4;
            }
        }

        if (capture === 3) {
            event.gizmo = {
                date: Date.now(),
                count: event.touches.length,
                clientX: 0,
                clientY: 0,
                clientR: 0
            };

            for (let i = 0; i < event.touches.length; i++) {
                event.gizmo.clientX += event.touches[i].clientX;
                event.gizmo.clientY += event.touches[i].clientY;
            }

            event.gizmo.clientX /= event.touches.length;
            event.gizmo.clientY /= event.touches.length;

            if (event.touches.length > 1) {
                for (let i = 0; i < event.touches.length; i++) {
                    let dX = event.touches[i].clientX - event.gizmo.clientX,
                        dY = event.touches[i].clientY - event.gizmo.clientY;
                    event.gizmo.clientR += Math.sqrt(dX * dX + dY * dY);
                }

                event.gizmo.clientR /= event.touches.length;
            }

            event.preventDefault();
        } else {
            event.stopPropagation();
        }
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('touchstart', function (event) { /////////////////////////////////////////////////////////////////////////////
        if (gizmo.count !== event.gizmo.count) {
            gizmo.count = event.gizmo.count;
            gizmo.date = event.gizmo.date;

            gizmo.clientX_0 = gizmo.clientX = event.gizmo.clientX;
            gizmo.clientY_0 = gizmo.clientY = event.gizmo.clientY;
            gizmo.clientR = event.gizmo.clientR;

            if (object_list === undefined) {
                gizmo.date_0 = gizmo.count === 1 ? gizmo.date : 0;
                gizmo.target = event.target;

                if (event.object_list !== undefined) {
                    object_list = event.object_list;

                    let top = object_list.top,
                        onTouchStart = true;

                    while (top !== null) {
                        top.target.touch.count = gizmo.count;

                        let clientRect = top.target.target.getBoundingClientRect();
                        top.target.touch.layerX_0 = top.target.touch.layerX = gizmo.clientX - clientRect.left;
                        top.target.touch.layerY_0 = top.target.touch.layerY = gizmo.clientY - clientRect.top;

                        top.target.touch.vX = 0;
                        top.target.touch.vY = 0;

                        if (onTouchStart)
                            onTouchStart = !top.target.onTouchStart(gizmo.target);

                        top = top.parent;
                    }

                    if (gizmo.count === 1) {
                        timeout = setTimeout(function () {
                            timeout = 0;

                            let dX = gizmo.clientX - gizmo.clientX_0,
                                dY = gizmo.clientY - gizmo.clientY_0;

                            if (Math.sqrt(dX * dX + dY * dY) < 10) {
                                let top = object_list.top,
                                    onHold = true;

                                while ((top !== null) && onHold) {
                                    onHold = !top.target.onHold(gizmo.target);
                                    top = top.parent;
                                }
                            }
                        }, 500);
                    }
                } else {
                    object_list = null;
                }
            } else {
                gizmo.date_0 = 0;

                if (object_list !== null) {
                    if (timeout > 0) {
                        clearTimeout(timeout);
                        timeout = 0;
                    }

                    let top = object_list.top,
                        onTouchStart = true;

                    while (top !== null) {
                        top.target.touch.count = gizmo.count;

                        let clientRect = top.target.target.getBoundingClientRect();
                        top.target.touch.layerX = gizmo.clientX - clientRect.left;
                        top.target.touch.layerY = gizmo.clientY - clientRect.top;

                        top.target.touch.vX = 0;
                        top.target.touch.vY = 0;

                        if (onTouchStart)
                            onTouchStart = !top.target.onTouchStart(gizmo.target);

                        top = top.parent;
                    }
                }
            }
        }
    }, {
        capture: false,
        passive: true
    });

    document.addEventListener('touchmove', function (event) { //////////////////////////////////////////////////////////////////////////////
        if (capture === 3) {
            event.gizmo = {
                date: Date.now(),
                count: event.touches.length,
                clientX: 0,
                clientY: 0,
                clientR: 0
            };

            for (let i = 0; i < event.touches.length; i++) {
                event.gizmo.clientX += event.touches[i].clientX;
                event.gizmo.clientY += event.touches[i].clientY;
            }

            event.gizmo.clientX /= event.touches.length;
            event.gizmo.clientY /= event.touches.length;

            if (event.touches.length > 1) {
                let dX, dY;
                for (let i = 0; i < event.touches.length; i++) {
                    dX = event.touches[i].clientX - event.gizmo.clientX;
                    dY = event.touches[i].clientY - event.gizmo.clientY;
                    event.gizmo.clientR += Math.sqrt(dX * dX + dY * dY);
                }

                event.gizmo.clientR /= event.touches.length;
            }

            event.preventDefault();
        } else {
            event.stopPropagation();
        }
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('touchmove', function (event) { //////////////////////////////////////////////////////////////////////////////
        let dt = event.gizmo.date - gizmo.date,
            dX = event.gizmo.clientX - gizmo.clientX,
            dY = event.gizmo.clientY - gizmo.clientY,
            kR = (event.gizmo.clientR !== 0) && (gizmo.clientR !== 0) ? event.gizmo.clientR / gizmo.clientR : 1;

        if ((dt > 8) && ((dX !== 0) || (dY !== 0) || (kR !== 1))) {
            gizmo.date = event.gizmo.date;
            gizmo.clientX = event.gizmo.clientX;
            gizmo.clientY = event.gizmo.clientY;
            gizmo.clientR = event.gizmo.clientR;

            if (object_list !== null) {
                let top = object_list.top,
                    onTouchMove = true;

                while (top !== null) {
                    let clientRect = top.target.target.getBoundingClientRect();
                    top.target.touch.layerX = gizmo.clientX - clientRect.left;
                    top.target.touch.layerY = gizmo.clientY - clientRect.top;

                    top.target.touch.vX = (top.target.touch.vX + dX / dt) / 2;
                    top.target.touch.vY = (top.target.touch.vY + dY / dt) / 2;

                    if (onTouchMove)
                        onTouchMove = !top.target.onTouchMove(dX, dY, kR);

                    top = top.parent;
                }
            }
        }
    }, {
        capture: false,
        passive: true
    });

    document.addEventListener('touchend', function (event) { ///////////////////////////////////////////////////////////////////////////////
        if (capture === 3) {
            if (event.touches.length === 0) {
                event.gizmo = {
                    date: Date.now(),
                    count: 0
                };
            } else {
                event.gizmo = {
                    date: Date.now(),
                    count: event.touches.length,
                    clientX: 0,
                    clientY: 0,
                    clientR: 0
                };

                for (let i = 0; i < event.touches.length; i++) {
                    event.gizmo.clientX += event.touches[i].clientX;
                    event.gizmo.clientY += event.touches[i].clientY;
                }

                event.gizmo.clientX /= event.touches.length;
                event.gizmo.clientY /= event.touches.length;

                if (event.touches.length > 1) {
                    for (let i = 0; i < event.touches.length; i++) {
                        let dX = event.touches[i].clientX - event.gizmo.clientX;
                        let dY = event.touches[i].clientY - event.gizmo.clientY;
                        event.gizmo.clientR += Math.sqrt(dX * dX + dY * dY);
                    }

                    event.gizmo.clientR /= event.touches.length;
                }
            }

            event.preventDefault();
        } else {
            if ((event.touches.length === 0) && (capture === 4))
                capture = 0;

            event.stopPropagation();
        }
    }, {
        capture: true,
        passive: false
    });

    document.addEventListener('touchend', function (event) { ///////////////////////////////////////////////////////////////////////////////
        if (gizmo.count !== event.gizmo.count) {
            gizmo.count = event.gizmo.count;

            if (object_list !== null) {
                let top = object_list.top;

                if (event.gizmo.count === 0) {
                    if (timeout > 0) {
                        clearTimeout(timeout);
                        timeout = 0;
                    }

                    let onTouchEnd = true,
                        dX = gizmo.clientX - gizmo.clientX_0,
                        dY = gizmo.clientY - gizmo.clientY_0;

                    if ((event.gizmo.date - gizmo.date_0 < 300) && (Math.sqrt(dX * dX + dY * dY) < 3)) {
                        if ((gizmo.target instanceof HTMLAnchorElement) && (gizmo.target.hasAttribute('href'))) {
                            if (event.ctrlKey || event.metaKey) {
                                window.open(gizmo.target.getAttribute('href'), 'blank_');
                            } else if (gizmo.target.hasAttribute('target')) {
                                window.open(gizmo.target.getAttribute('href'), gizmo.target.getAttribute('target'));
                            } else {
                                location.href = gizmo.target.getAttribute('href');
                            }
                        } else {
                            let onTap = true;

                            while (top !== null) {
                                top.target.touch.count = 0;
                                top.target.touch.vX = 0;
                                top.target.touch.vY = 0;

                                if (onTouchEnd)
                                    onTouchEnd = !top.target.onTouchEnd();

                                if (onTap)
                                    onTap = !top.target.onTap(gizmo.target);

                                top.target.touch.layerX_0 = top.target.touch.layerX = 0;
                                top.target.touch.layerY_0 = top.target.touch.layerY = 0;

                                top = top.parent;
                            }
                        }
                    } else {
                        if (event.gizmo.date - gizmo.date < 100) {
                            while (top !== null) {
                                top.target.touch.count = 0;

                                if (onTouchEnd)
                                    onTouchEnd = !top.target.onTouchEnd();

                                top.target.touch.vX = 0;
                                top.target.touch.vY = 0;
                                top.target.touch.layerX_0 = top.target.touch.layerX = 0;
                                top.target.touch.layerY_0 = top.target.touch.layerY = 0;

                                top = top.parent;
                            }
                        } else {
                            while (top !== null) {
                                top.target.touch.count = 0;
                                top.target.touch.vX = 0;
                                top.target.touch.vY = 0;

                                if (onTouchEnd)
                                    onTouchEnd = !top.target.onTouchEnd();

                                top.target.touch.layerX_0 = top.target.touch.layerX = 0;
                                top.target.touch.layerY_0 = top.target.touch.layerY = 0;

                                top = top.parent;
                            }
                        }
                    }

                    object_list = undefined;
                    capture = 0;
                } else {
                    gizmo.count = event.gizmo.count;
                    gizmo.clientX = event.gizmo.clientX;
                    gizmo.clientY = event.gizmo.clientY;
                    gizmo.clientR = event.gizmo.clientR;

                    while (top !== null) {
                        top.target.touch.count = gizmo.count;

                        let clientRect = top.target.target.getBoundingClientRect();
                        top.target.touch.layerX_0 = top.target.touch.layerX = gizmo.clientX - clientRect.left;
                        top.target.touch.layerY_0 = top.target.touch.layerY = gizmo.clientY - clientRect.top;

                        top = top.parent;
                    }
                }
            } else if (event.gizmo.count === 0) {
                object_list = undefined;
                capture = 0;
            }
        }
    }, {
        capture: false,
        passive: true
    });

    document.addEventListener('wheel', function (event) { //////////////////////////////////////////////////////////////////////////////////
        if (capture === 0) {
            event.gizmo = {
                date: Date.now(),
                count: 0,
                clientX: event.clientX,
                clientY: event.clientY,
                clientR: 0
            };
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }, {
        capture: true,
        passive: false
    });

    if (window.self === window.top) {
        document.addEventListener('wheel', function (event) { //////////////////////////////////////////////////////////////////////////////
            let dt = event.gizmo.date - gizmo.date;
            if (dt > 8) {
                gizmo.date = event.gizmo.date;

                if ((event.object_list !== undefined) && (event.object_list !== null)) {
                    let top = event.object_list.top,
                        onTouchMove = true;

                    while (top !== null) {
                        top.target.touch.count = 1;

                        let clientRect = top.target.target.getBoundingClientRect();
                        top.target.touch.layerX_0 = top.target.touch.layerX = event.gizmo.clientX - clientRect.left;
                        top.target.touch.layerY_0 = top.target.touch.layerY = event.gizmo.clientY - clientRect.top;

                        if (event.ctrlKey) {
                            top.target.touch.vX = 0;
                            top.target.touch.vY = 0;

                            if (onTouchMove)
                                onTouchMove = !top.target.onTouchMove(0, 0, 1 - event.deltaY / 300);
                        } else {
                            top.target.touch.vX = -event.deltaX / dt;
                            top.target.touch.vY = -event.deltaY / dt;

                            if (onTouchMove)
                                onTouchMove = !top.target.onTouchMove(-4 * event.deltaX, -4 * event.deltaY, 1);
                        }

                        top.target.touch.count = 0;
                        top = top.parent;
                    }
                }
            }
        }, {
            capture: false,
            passive: true
        });
    } else {
        document.addEventListener('wheel', function (event) { //////////////////////////////////////////////////////////////////////////////
            let dt = event.gizmo.date - gizmo.date;
            if (dt > 8) {
                gizmo.date = event.gizmo.date;

                if ((event.object_list !== undefined) && (event.object_list !== null)) {
                    let top = event.object_list.top,
                        onTouchMove = true;

                    while (top !== null) {
                        top.target.touch.count = 1;

                        let clientRect = top.target.target.getBoundingClientRect();
                        top.target.touch.layerX_0 = top.target.touch.layerX = event.gizmo.clientX - clientRect.left;
                        top.target.touch.layerY_0 = top.target.touch.layerY = event.gizmo.clientY - clientRect.top;

                        if (event.ctrlKey) {
                            top.target.touch.vX = 0;
                            top.target.touch.vY = 0;

                            if (onTouchMove)
                                onTouchMove = !top.target.onTouchMove(0, 0, 1 - event.deltaY / 300);
                        } else {
                            window.top.postMessage({
                                type: 'wheel',
                                deltaX: event.deltaX,
                                deltaY: event.deltaY
                            }, '*');
                        }

                        top.target.touch.count = 0;
                        top = top.parent;
                    }
                }
            }
        }, {
            capture: false,
            passive: true
        });
    }

    myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Touch ///
        /** @this {myLib.Touch & (myLib.Element.HTML | myLib.Element.SVG)} */
        function Touch() {
            this.defineProperty('touch', new myLib.Touch.Gizmo());

            // Listeners

            this.target.addEventListener('focusin', (/** @type {FocusEvent} */ event) => {
                this.onFocus(event.target);
            }, {
                capture: false,
                passive: true
            });

            this.target.addEventListener('focusout', (/** @type {FocusEvent} */ event) => {
                this.onBlur(event.target);
            }, {
                capture: false,
                passive: true
            });

            this.target.addEventListener('keydown', (/** @type {KeyboardEvent} */ event) => {
                switch (this.onKeyDown(event.code, event.key, {
                    alt: event.altKey,
                    ctrl: event.ctrlKey,
                    meta: event.metaKey,
                    shift: event.shiftKey
                })) {
                    case true:
                        event.preventDefault();
                    case false:
                        event.stopPropagation();
                        return;
                }
            }, {
                capture: false,
                passive: false
            });

            this.target.addEventListener('mousedown', (/** @type {MouseEvent} */ event) => {
                if (event.object_list === undefined) {
                    let object = { target: this, parent: null };
                    event.object_list = { top: object, bottom: object };
                } else {
                    event.object_list.bottom = event.object_list.bottom.parent = { target: this, parent: null };
                }
            }, {
                capture: false,
                passive: true
            });

            this.target.addEventListener('touchstart', (/** @type {TouchEvent} */ event) => {
                if (event.object_list === undefined) {
                    let object = { target: this, parent: null };
                    event.object_list = { top: object, bottom: object };
                } else {
                    event.object_list.bottom = event.object_list.bottom.parent = { target: this, parent: null };
                }
            }, {
                capture: false,
                passive: true
            });

            this.target.addEventListener('wheel', (/** @type {WheelEvent} */ event) => {
                if (event.object_list === undefined) {
                    let object = { target: this, parent: null };
                    event.object_list = { top: object, bottom: object };
                } else {
                    event.object_list.bottom = event.object_list.bottom.parent = { target: this, parent: null };
                }
            }, {
                capture: false,
                passive: true
            });
        },

        // Extends
        myLib,

        // Events
        {
            onBlur(target) { },
            onFocus(target) { },
            onHold(target) { },
            onKeyDown(code, key, modifiers) { },
            onTap(target) { },
            onTouchStart(target) { },
            onTouchMove(dX, dY, kR) { },
            onTouchEnd() { }
        }
    );

    myLib.Touch.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////// Gizmo ///
        /** @this {myLib.Touch.Gizmo} */
        function Gizmo() {
            myLib.call(this);

            // Initialization

            this.defineProperty('count', 0);
            this.defineProperty('move', undefined);

            this.defineProperty('layerX', 0);
            this.defineProperty('layerX_0', 0);
            this.defineProperty('layerY', 0);
            this.defineProperty('layerY_0', 0);

            this.defineProperty('vX', 0);
            this.defineProperty('vY', 0);
        },

        // Extends
        myLib
    );
}