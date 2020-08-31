export function forEachChild(parent: ParentNode, callback: (element: HTMLElement) => void) {
    for(let i=0; i<parent.children.length; i++) {
        callback(parent.children[i] as HTMLElement);
    }
}

export function findDirectDescendantWithClass(parent: ParentNode, className: string): HTMLElement | null {
    for(let i=0; i<parent.children.length; i++) {
        const child = parent.children[i];
        if(child.classList.contains(className))
            return child as HTMLElement;
    }

    return null;
}