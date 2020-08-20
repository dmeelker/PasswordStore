import React from "react";
import { Overlay } from "./Overlay";

interface ModalProps {
    children: any;
}

export function Modal(props: ModalProps) {
    return (
        <Overlay opaque={true}>
            <div className="m-auto bg-white shadow overflow-hidden sm:rounded-lg">
                {props.children}
            </div>
        </Overlay>
    );
}