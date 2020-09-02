import React from "react";
import { conditionalClass } from "../Utilities/RenderHelpers";

interface ListViewProps {
    children: any;
}

export function ListView(props: ListViewProps) {
    return <div className="border overflow-y-auto h-full mr-2" style={{minWidth: "12rem"}}>
        {props.children.length == 0 && "None"}
        {props.children}
    </div>
}

interface ListViewItemProps {
    key: string;
    children: any;
    selected: boolean;
    onClick: () => void;
}

export function ListViewItem(props: ListViewItemProps) {
        function onClick(event: React.MouseEvent) {
        props.onClick();
        event.preventDefault();
    }

    return <button onClick={onClick} className={"block px-2 md:py-1 w-full text-left" + conditionalClass(props.selected, "bg-green-300")}>
        {props.children}
    </button>
}
