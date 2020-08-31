import { useState, useEffect, CSSProperties } from "react";
import React from "react";
import { conditionalClass } from "../Utilities/RenderHelpers";
import { useDocumentResizeHandler } from "../Utilities/Hooks";
import { forEachChild, findDirectDescendantWithClass } from "../Utilities/DomHelpers";

interface TabsProps {
    children: any;
}

export function Tabs(props: TabsProps) {
    const [activeTab, setActiveTab] = useState(props.children[0].props.id);
    const tabContainerRev = React.useRef<HTMLDivElement>(null);

    function findMainTabDiv() {
        if (!tabContainerRev.current)
            return null;

        return findDirectDescendantWithClass(tabContainerRev.current, "main-tab");
    }

    function resizeTabs() {
        if (!tabContainerRev.current)
            return;

        const mainDiv = tabContainerRev.current;
        const mainTabDiv = findMainTabDiv() ?? mainDiv.children[0];
        
        forEachChild(mainDiv, (tabDiv) => {
            if (tabDiv !== mainTabDiv) {
                tabDiv.style.height = "1px";
            }
        });

        forEachChild(mainDiv, (tabDiv) => {
            if (tabDiv !== mainTabDiv) {
                tabDiv.style.height = mainTabDiv.clientHeight + "px";
            }
        })
    }

    useDocumentResizeHandler(resizeTabs);
    useEffect(resizeTabs);

    function tabClicked(tab: any, e: React.MouseEvent) {
        setActiveTab(tab.props.id);
        e.preventDefault();
    }

    return <div className="flex flex-col">
        <div className="">
            {React.Children.map(props.children, (child) => {
                
                return <button
                    onClick={(e) => tabClicked(child, e)}
                    className={"px-2 py-1 bg-gray-300 rounded-t mr-1 " + (activeTab === child.props.id ? "bg-green-300" : "")}>{child.props.title}</button>;
                })
            }
        </div>
        <div className="flex-1 border" style={{display: "grid"}} ref={tabContainerRev}>
            {React.Children.map(props.children, (child) => {
                    const style: CSSProperties = {
                        gridRowStart: 1, 
                        gridColumnStart: 1, 
                        visibility: activeTab === child.props.id ? "visible" : "hidden"
                    };
                return <div style={style} className={"overflow-hidden p-0 md:p-2" + conditionalClass(child.props.isMain, "main-tab")}>
                    {React.cloneElement(child)}
                </div>;
            })
            }</div>
    </div>
}

interface TabProps {
    id: string;
    title: string;
    children: any;
    isMain?: boolean;
}

export function Tab(props: TabProps) {
    return <>{props.children}</>;
}