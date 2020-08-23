import React from "react";
import { Overlay } from "./Overlay";

interface ModalProps {
    title?: string;
    children: any;
}

export function Modal(props: ModalProps) {
    return (
        <Overlay opaque={true}>
            <div className="m-auto bg-white shadow overflow-hidden sm:rounded-lg">
                {props.title && <ModalTitle title={props.title}/>}
                <div className="p-2">{props.children}</div>
            </div>
        </Overlay>
    );
}

interface ModalTitleProps {
    title: string;
}

function ModalTitle(props: ModalTitleProps) {
    return <div className="p-2 bg-green-200">{props.title}</div>
}