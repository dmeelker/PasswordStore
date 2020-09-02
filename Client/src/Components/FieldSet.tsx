import React from "react";

interface FieldSetProps {
    title: string;
    children: any;
}

export function FieldSet(props: FieldSetProps) {
    return <fieldset className="bg-gray-200">
        <legend>{props.title}</legend>
        <div className="p-2">{props.children}</div>
    </fieldset>;
}