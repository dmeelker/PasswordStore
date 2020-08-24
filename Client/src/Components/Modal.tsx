import React from "react";
import { Overlay } from "./Overlay";

interface ModalProps {
    title?: string;
    children: any;
}

export function Modal(props: ModalProps) {
    return (
        <Overlay opaque={true}>
            <div className="m-auto bg-white shadow overflow-hidden rounded-lg flex flex-col" style={{maxHeight: "100vh"}}>
                {props.title && <ModalTitle title={props.title}/>}
                <div className="p-2 overflow-x-hidden overflow-y-auto">{props.children}</div>
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