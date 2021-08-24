import React, { useState, useCallback, useEffect } from "react";
import "./App.css";

function App() {
    const [mysqlData, setMysqlData] = useState([]);

    const fetchData = useCallback(() => {
        console.log("fetch");
    }, []);

    useEffect(fetchData, []);

    return (
        <div className="App">
            <div className="item-wrapper">
                <div className="item-title">MySQL</div>
            </div>
            <div className="item-wrapper">
                <div className="item-title">Redis</div>
            </div>
            <div className="item-wrapper">
                <div className="item-title">MongoDB</div>
            </div>
            <div className="item-wrapper">
                <div className="item-title">ElasticSearch</div>
            </div>
        </div>
    );
}

export default App;
