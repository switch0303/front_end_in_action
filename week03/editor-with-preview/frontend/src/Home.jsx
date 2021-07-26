import React from "react";
import { Link } from "react-router-dom";

const configs = [
    {
        name: "Week01",
        children: [
            { name: "EditorDemo", path: "/editordemo" },
            { name: "GrayScale", path: "/grayscale" },
        ],
    },
    {
        name: "Week02",
        children: [
            { name: "TemplateEngineDemo", path: "/template_engine_demo" },
        ],
    },
    {
        name: "Week03",
        children: [
            { name: "EditorWithPreview", path: "/editor_with_preview" },
        ],
    },
];

function Home() {
    return (
        <div
            style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {configs.map((item) => {
                return (
                    <div key={item.name} style={{ marginBottom: 12 }}>
                        <div
                            style={{
                                backgroundColor: "#614BA6",
                                color: "#fff",
                                fontSize: "20px",
                                padding: 10,
                                textAlign: "center",
                            }}
                        >
                            {item.name}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                margin: "0 -10px",
                            }}
                        >
                            {item.children.map((child) => {
                                return (
                                    <div
                                        key={child.name}
                                        style={{
                                            width: 180,
                                            height: 180,
                                            margin: 10,
                                            backgroundColor: "#efefef",
                                            borderRadius: 20,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Link to={child.path}>
                                            {child.name}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Home;
