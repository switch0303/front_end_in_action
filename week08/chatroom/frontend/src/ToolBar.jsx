import React from "react";
import _ from "lodash";
import "./ToolBar.scss";

export default function ToolBar(props) {
    const {
        tools,
        selectedTool,
        onChange,
    } = props;

    return (
        <div className="tool-bar">
            {
                _.map(tools, tool => {
                    return (
                        <span
                            key={tool.name}
                            className={selectedTool === tool.name ? "active tool" : "tool"}
                            onClick={() => {
                                if (typeof onChange === "function") {
                                    onChange(tool.name);
                                }
                            }}
                        >
                            {tool.text}
                        </span>
                    )
                })
            }
        </div>
    )
}
