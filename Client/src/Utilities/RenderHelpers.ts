function wrapClassName(className: string): string {
    return " " + className + " " ;
}

export function conditionalClass(firstClass: boolean, firstClassName: string, secondClassName: string = ""): string {
    return wrapClassName(firstClass ? firstClassName : secondClassName);
}

export function alternatingClass(index: number, oddClassName: string, evenClassName: string = ""): string {
    return wrapClassName(index % 2 === 1 ? oddClassName : evenClassName);
}