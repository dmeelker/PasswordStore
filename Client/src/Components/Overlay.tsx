import React from "react";
import { conditionalClass } from "../Utilities/RenderHelpers";

interface OverlayProps {
    children: any;
    opaque?: boolean;
    onClick?: () => void;
}

export function Overlay(props: OverlayProps) {
    return (
        <div className={"fixed inset-0 w-screen h-screen flex" + conditionalClass(props.opaque ?? false, "bg-black bg-opacity-25", "")}
            onClick={props.onClick}>
            {props.children}
        </div>
    );
}