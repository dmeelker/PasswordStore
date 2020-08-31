import React from "react";

export function useGlobalKeyboardListener(eventHandler: (event: KeyboardEvent) => void) {
    React.useEffect(() => {
        window.document.addEventListener("keydown", eventHandler);

        return () => {
            window.document.removeEventListener("keydown", eventHandler);
        };
    });
}

export function useDocumentResizeHandler(handler: () => void) {
    React.useEffect(() => {
        const resizeHandler = (e: UIEvent) => {
            handler();
        };
        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    });
}