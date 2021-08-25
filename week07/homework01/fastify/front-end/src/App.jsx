import React, { useState, useCallback, useEffect } from "react";
import "./App.css";

function App() {
    const [mysqlData, setMysqlData] = useState([]);
    const [text1, setText1] = useState("");
    const [loading1, setLoading1] = useState(false);

    const fetchMysqlData = useCallback(() => {
        fetch("./api/mysql/query")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const {result = []} = (data || {});
            setMysqlData(result);
        });
    }, []);

    const fetchData = useCallback(() => {
        fetchMysqlData();
    }, []);

    useEffect(fetchData, []);

    return (
        <div className="App">
            <div className="item-wrapper">
                <div className="item-title">MySQL</div>
                <div className="item-main">
                    <div>
                        <input type="text" value={text1} onChange={e => setText1(e.target.value)} />
                        <button
                            style={{marginLeft: 6}}
                            disabled={(text1 || "").trim() === ""}
                            onClick={async () => {
                                const value = (text1 || "").trim();
                                if (value) {
                                    try {
                                        setLoading1(true);
                                        await fetch(`./api/mysql/insert?value=${value}`);
                                        fetchMysqlData();
                                    } finally {
                                        setLoading1(false);
                                    } 
                                }
                            }}
                        >
                            add
                        </button>
                    </div>
                    <div style={{marginTop: 10}}>
                        {
                            (mysqlData && mysqlData.length)
                                ? (
                                <table border="1">
                                    <thead><tr><th>名称</th><th>添加时间</th></tr></thead>
                                    <tbody>
                                        {
                                            (mysqlData || []).map(item => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.name}</td>
                                                        <td>{item.date}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                )
                                : null
                        }
                        
                        
                    </div>
                </div>
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
