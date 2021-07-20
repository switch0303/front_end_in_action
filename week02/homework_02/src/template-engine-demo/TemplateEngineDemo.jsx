import React, {useRef, useEffect} from "react";
import EngineDOM from "./engine/EngineDOM";

const tmpl = `<div class="newslist">
        <div class="img" v-if="info.showImage"><img src="{{image}}"/></div>
        <div class="date" v-if="info.showDate">{{info.name}}</div>
        <div class="img" data="{{info.name}}">{{info.name}}</div>
    </div>`;

function TemplateEngineDemo() {
    const containerRef = useRef(null);
    useEffect(() => {
        console.log("effect");
        const engine = new EngineDOM().mounted(containerRef.current);
        engine.render(tmpl, {
            image: "some img",
            info: { showImage: true, showDate: false, name: "aaa" },
        });
    }, []);

    return (
        <div ref={containerRef} />
    )
}

export default TemplateEngineDemo;
