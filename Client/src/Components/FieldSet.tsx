import React from "react";

interface FieldSetProps {
    title: string;
    children: any;
}

export function FieldSet(props: FieldSetProps) {
    return <fieldset>
        <legend>{props.title}</legend>
        <div>{props.children}</div>
    </fieldset>;
}