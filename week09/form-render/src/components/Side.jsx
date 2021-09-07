import React from "react";
import { defaultSettings } from "../settings";
import Element from "./Element";

export default function Side(props) {
    return (
        <div>
            {Array.isArray(defaultSettings) ? (
                defaultSettings.map((item) => {
                    return (
                        <div key={item.title}>
                            <div className="flex flex-wrap">
                                {Array.isArray(item.widgets) ? (
                                    item.widgets.map((widget) => {
                                        return (
                                            <Element
                                                key={widget.text}
                                                {...props}
                                                {...widget}
                                            />
                                        );
                                    })
                                ) : (
                                    <div>配置有误</div>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div>配置有误</div>
            )}
        </div>
    );
}
