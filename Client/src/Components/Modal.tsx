import React from "react";
import { Overlay } from "./Overlay";

interface ModalProps {
    title?: string;
    children: any;
    buttonBar?: any;
}

export function Modal(props: ModalProps) {
    return (
        <Overlay opaque={true}>
            <div className="m-auto bg-white shadow overflow-hidden rounded-lg flex flex-col" style={{maxHeight: "100vh"}}>
                {props.title && <ModalTitle title={props.title}/>}
                <div className="p-2 overflow-x-hidden overflow-y-auto">{props.children}</div>
                {props.buttonBar && 
                    <div className="p-2 pb-2 bg-gray-100 border-t-2 border-gray-300 button-bar-right">{props.buttonBar}</div>
                }
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