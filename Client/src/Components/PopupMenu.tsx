import React, { MouseEvent } from "react";
import { Overlay } from "./Overlay";

interface PopupMenuProps {
    x: number;
    y: number;
    onHide: () => void;
    children: any;
}

export function PopupMenu(props: PopupMenuProps) {
    return (<Overlay onClick={() => props.onHide()}>
        <div className="absolute bg-white shadow" style={{left: props.x, top: props.y}}>
            {props.children}
        </div>
    </Overlay>);
}

interface MenuItemProps {
    label: string;
    onClick: () => void;
}

export function MenuItem(props: MenuItemProps) {
    function onClick(event: MouseEvent) {
        props.onClick();
    }

    return <button className="block w-full text-left pl-2 pr-4 py-1 hover:bg-green-200" onClick={onClick}>{props.label}</button>;
}

export function MenuSeparator() {
    return <div className="h-px bg-gray-400"></div>;
}