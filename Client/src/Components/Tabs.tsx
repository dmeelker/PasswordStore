import { useState } from "react";
import React from "react";

interface TabsProps {
    children: any;
}

export function Tabs(props: TabsProps) {
    const [activeTab, setActiveTab] = useState(props.children[0].props.id);

    function tabClicked(tab: any, e: React.MouseEvent) {
        setActiveTab(tab.props.title);
        e.preventDefault();
    }

    return <div className="flex flex-col">
        <div className="">
            {React.Children.map(props.children, (child) => {
                
                return <button
                    onClick={(e) => tabClicked(child, e)}
                    className={"px-2 py-1 bg-green-200 rounded-t mr-1 border-b-2 border-green-600" + (activeTab === child.props.id ? "selected" : "")}>{child.props.title}</button>;
                })
            }
        </div>
        <div className="flex-1 border" style={{display: "grid"}}>
            {React.Children.map(props.children, (child) => {
                return React.cloneElement(child, {style: {gridRowStart: 1, gridColumnStart: 1, visibility: activeTab === child.props.id ? "visible" : "hidden"}});})
            }</div>
    </div>
}

interface TabProps {
    id: string;
    title: string;
    children: any;
    style?: React.CSSProperties;
}

export function Tab(props: TabProps) {
    return <div style={props.style}>{props.children}</div>;
}