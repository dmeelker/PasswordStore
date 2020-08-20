import React from "react";

export function useGlobalKeyboardListener(eventHandler: (event: KeyboardEvent) => void) {
    React.useEffect(() => {
        window.document.addEventListener("keydown", eventHandler);

        return () => {
            window.document.removeEventListener("keydown", eventHandler);
        };
    });
}