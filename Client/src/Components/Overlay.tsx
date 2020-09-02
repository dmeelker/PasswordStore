import React, { useEffect, useState } from "react";
import { conditionalClass } from "../Utilities/RenderHelpers";

interface OverlayProps {
    children: any;
    opaque?: boolean;
    onClick?: () => void;
}

let stackIndex = 0;

export function Overlay(props: OverlayProps) {
    const [zindex, setZindex] = useState(stackIndex);

    useEffect(() => {
        stackIndex++;

        return () => {
            stackIndex--;
        };
    });

    return (
        <div className={"fixed inset-0 w-screen h-screen flex" + conditionalClass(props.opaque ?? false, "bg-black bg-opacity-25", "")}
            style={{zIndex: 1000 + zindex}}
            onClick={props.onClick}>
            {props.children}
        </div>
    );
}