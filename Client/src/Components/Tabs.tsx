import { useState, useEffect, CSSProperties } from "react";
import React from "react";

interface TabsProps {
    children: any;
}

export function Tabs(props: TabsProps) {
    const [activeTab, setActiveTab] = useState(props.children[0].props.id);

    const tabDivs = new Map<any, React.RefObject<HTMLDivElement>>();

    for(let child of props.children) {
        tabDivs.set(child, React.useRef<HTMLDivElement>(null));
    }

    function resizeTabs() {
        const mainTab = props.children.filter((tab: any) => tab.props.isMain)[0] ?? props.children[0];
        const mainTabDiv = tabDivs.get(mainTab)?.current;

        tabDivs.forEach((tab, key) => {
            if(tab.current && key !== mainTab) {
                tab.current.style.height = "1px";
            }
        });

        tabDivs.forEach((tab, key) => {
            if(key !== mainTab) {
                if(tab.current) {
                    tab.current.style.height = mainTabDiv?.clientHeight + "px";
                }
            }
        });
    }

    useEffect(() => {
        const resizeHandler = (e: UIEvent) => {
            resizeTabs();
        };
        window.addEventListener("resize", resizeHandler);

        resizeTabs();

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    });

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
        <div className="flex-1 border" style={{display: "grid"}}>
            {React.Children.map(props.children, (child) => {
                    const style: CSSProperties = {
                        gridRowStart: 1, 
                        gridColumnStart: 1, 
                        visibility: activeTab === child.props.id ? "visible" : "hidden"
                    };

                return <div ref={tabDivs.get(child) as React.RefObject<HTMLDivElement>} style={style} className="overflow-hidden p-0 md:p-2">
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