import React, { useRef, useEffect, useState } from "react";
import EngineDOM from "./engine/EngineDOM";
import imgCat from "./cat.png";

const tmpl = `<div class="newslist">
    <div class="img" v-if="info.showImage"><img src="{{image}}"/></div>
    <div class="date" v-if="info.showDate">{{info.date}}</div>
    <div class="name">{{info.name}}</div>
</div>`;

const dataObj = {
    image: imgCat,
    info: {
        showImage: true,
        showDate: false,
        name: "cat",
        date: "2021-07-20",
    },
};

const engine = new EngineDOM();

function TemplateEngineDemo() {
    const containerRef = useRef(null);
    const [renderHTML, setRenderHTML] = useState(null);
    const [data, setData] = useState(dataObj);

    useEffect(() => {
        engine.mounted(containerRef.current);
        renderTemplate();
    }, []);

    useEffect(() => {
        renderTemplate();
    }, [data]);

    function renderTemplate() {
        containerRef.current.innerHTML = "";
        engine.render(tmpl, data, function () {
            setRenderHTML(getRenderHTML());
        });
    }

    function getRenderHTML() {
        if (containerRef.current && containerRef.current.innerHTML) {
            return containerRef.current.innerHTML;
        } else {
            return null;
        }
    }

    return (
        <div
            style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ marginTop: 10, marginRight: 20 }}>
                    <div style={{ marginBottom: 6, fontWeight: "bold" }}>
                        template:
                    </div>
                    <div
                        style={{
                            border: "1px solid #ccc",
                            height: 160,
                            padding: 20,
                        }}
                    >
                        <pre>{tmpl}</pre>
                    </div>
                </div>
                <div style={{ marginTop: 10, marginRight: 20 }}>
                    <div style={{ marginBottom: 6, fontWeight: "bold" }}>
                        data:
                    </div>
                    <div
                        style={{
                            border: "1px solid #ccc",
                            height: 160,
                            padding: 20,
                        }}
                    >
                        <pre>{JSON.stringify(data, null, 4)}</pre>
                    </div>
                </div>
                <div style={{ marginTop: 10 }}>
                    <div style={{ marginBottom: 6, fontWeight: "bold" }}>
                        Edit data here:
                    </div>
                    <div
                        style={{
                            border: "1px solid #ccc",
                            height: 160,
                            padding: 20,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <label htmlFor="image" style={{ marginRight: 10 }}>
                                image:
                            </label>
                            <input
                                name="image"
                                type="text"
                                value={data.image}
                                disabled
                                style={{ width: 220 }}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: 10,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <label
                                htmlFor="showImage"
                                style={{ marginRight: 10 }}
                            >
                                info.showImage:
                            </label>
                            <input
                                type="checkbox"
                                name="showImage"
                                checked={data.info.showImage}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        info: {
                                            ...data.info,
                                            showImage: e.target.checked,
                                        },
                                    });
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: 10,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <label
                                htmlFor="showDate"
                                style={{ marginRight: 10 }}
                            >
                                info.showDate:
                            </label>
                            <input
                                type="checkbox"
                                name="showDate"
                                checked={data.info.showDate}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        info: {
                                            ...data.info,
                                            showDate: e.target.checked,
                                        },
                                    });
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: 10,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <label htmlFor="name" style={{ marginRight: 10 }}>
                                info.name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={data.info.name}
                                style={{ width: 220 }}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        info: {
                                            ...data.info,
                                            name: e.target.value,
                                        },
                                    });
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: 10,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <label htmlFor="date" style={{ marginRight: 10 }}>
                                info.date:
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={data.info.date}
                                style={{ width: 220 }}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        info: {
                                            ...data.info,
                                            date: e.target.value,
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 6, fontWeight: "bold" }}>
                    render:
                </div>
                <div
                    ref={containerRef}
                    style={{ border: "1px solid #ccc", padding: 20 }}
                />
            </div>
            <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 6, fontWeight: "bold" }}>
                    renderHTML:
                </div>
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: 20,
                    }}
                >
                    <pre style={{ whiteSpace: "pre-wrap" }}>{renderHTML}</pre>
                </div>
            </div>
        </div>
    );
}

export default TemplateEngineDemo;
