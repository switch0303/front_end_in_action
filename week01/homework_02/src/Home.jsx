import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div
            style={{
                padding: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <div>
                <Link to="/editordemo">EditorDemo</Link>
            </div>
        </div>
    );
}

export default Home;
