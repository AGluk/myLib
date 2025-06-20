declare namespace myLib {
    abstract class Touch extends myLib { ///////////////////////////////////////////////////////////////////////////////////// Touch ///
        constructor();

        // Properties
        touch: Touch.Gizmo;
        target: HTMLElement | SVGElement;

        // Events
        onBlur(target: EventTarget): boolean;
        onFocus(target: EventTarget): boolean;
        onHold(target: Window.Element): boolean | void;
        onKeyDown(code: string, key: string, modifiers: Touch.Modifiers): boolean | void;
        onTap(target: Window.Element): boolean | void;
        onTouchStart(target: Window.Element): boolean | void;
        onTouchMove(dX: number, dY: number, kR: number): boolean | void;
        onTouchEnd(): boolean | void;
    } interface Touch {
        constructor: typeof Touch;
    }

    namespace Touch {
        class Gizmo extends myLib { ////////////////////////////////////////////////////////////////////////////////////// Gizmo ///
            constructor();

            // Properties
            count: number;
            move: boolean | number | string;

            layerX: number;
            layerX_0: number;
            layerY: number;
            layerY_0: number;

            vX: number;
            vY: number;
        } interface Gizmo {
            constructor: typeof Gizmo;
        }

        interface Modifiers {
            alt: boolean;
            ctrl: boolean;
            meta: boolean;
            shift: boolean;
        }
    }
}

declare namespace UIEvent {
    interface Gizmo {
        date: number;
        count: number;
        clientX?: number;
        clientY?: number;
        clientR?: number;
    }

    interface ObjectList {
        bottom: ObjectList.Node;
        top: ObjectList.Node;
    }

    namespace ObjectList {
        interface Node {
            target: myLib.Touch & myLib.Element.HTML;
            parent: Node;
        }
    }
}

declare interface MouseEvent {
    object_list: UIEvent.ObjectList;
    gizmo: UIEvent.Gizmo;
    target: Element;
}

declare interface TouchEvent {
    object_list: UIEvent.ObjectList;
    gizmo: UIEvent.Gizmo;
    target: Element;
}

declare interface WheelEvent {
    object_list: UIEvent.ObjectList;
    gizmo: UIEvent.Gizmo;
    target: Element;
}