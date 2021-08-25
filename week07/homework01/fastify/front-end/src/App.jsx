import React, { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";

const news = [
    {
        title: "小米5亿元收购自动驾驶技术公司深动科技",
        body: "小米集团披露公告称，公司与自动驾驶技术公司深动科技（DEEPMOTION TECH）相关订约方订立股份购买协议。整体收购总代价约为7737万美元（约合5亿元人民币），完成交易后，深动科技将成为小米全资附属公司。",
    },
    {
        title: "农夫山泉：上半年实现净利润40.13亿元，同比增40.1%",
        body: "农夫山泉在港交所公告，上半年实现净利润约为40.13亿元，同比增长40.1%；实现营收151.75亿元，同比增长31.4%；每股基本盈利为0.36元，同比增长33.3%。",
    },
    {
        title: "小米集团：二季度营收877.9亿元，超市场预期",
        body: "小米集团发布财报，2021年第二季度营收877.9亿元，预期840.89亿元，去年同期535.38亿元；净利润82.7亿元，市场预估59.9亿元，上半年净利润160.6亿元",
    },
    {
        title: "年薪220万招聘阿富汗项目生产经理？中交四公局：虚假诈骗信息，已报警",
        body: "针对昨日社交网络上大范围流传的“中交四公局招聘阿富汗战后重建项目-阿富汗南北走廊环线公路项目国别经理、生产经理”等信息，涉事公司辟谣称，“以上均为虚假诈骗信息，请社会各界人士切勿上当受骗。我司已采取报警处理，将严厉追究责任。”",
    },
];

function App() {
    const [mysqlData, setMysqlData] = useState([]);
    const [text1, setText1] = useState("");
    const [loading1, setLoading1] = useState(false);

    const [redisKey, setRedisKey] = useState("");
    const [redisValue, setRedisValue] = useState("");
    const [loading2, setLoading2] = useState(false);
    const [redisKeys, setRedisKeys] = useState([]);
    const [searchResult, setSearchResult] = useState({});
    const selectRef = useRef(null);

    const [mongodbData, setMongodbData] = useState([]);
    const [text3, setText3] = useState("");
    const [loading3, setLoading3] = useState(false);

    const [esData, setEsData] = useState({});
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading4, setLoading4] = useState(false);
    const inputRef = useRef(null);
    const selectRef2 = useRef(null);

    const fetchMysqlData = useCallback(() => {
        fetch("./api/mysql/query")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const { result = [] } = data || {};
                setMysqlData(result);
            });
    }, []);

    const fetchRedisKeys = useCallback(() => {
        fetch("./api/redis/getAllKeys")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const { result = [] } = data || {};
                setRedisKeys(result);
            });
    }, []);

    const fetchMongodbData = useCallback(() => {
        fetch("./api/todo/query")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const { result = [] } = data || {};
                setMongodbData(result);
            });
    }, []);

    const fetchData = useCallback(() => {
        fetchMysqlData();
        fetchRedisKeys();
        fetchMongodbData();
    }, []);

    useEffect(fetchData, []);

    return (
        <div className="App">
            <div className="item-wrapper">
                <div className="item-title">MySQL</div>
                <div className="item-main">
                    <div>
                        <input
                            type="text"
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                        />
                        <button
                            style={{ marginLeft: 6 }}
                            disabled={loading1 || (text1 || "").trim() === ""}
                            onClick={async () => {
                                const value = (text1 || "").trim();
                                if (value) {
                                    try {
                                        setLoading1(true);
                                        await fetch(
                                            `./api/mysql/insert?value=${value}`
                                        );
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
                    <div style={{ marginTop: 10 }}>
                        {mysqlData && mysqlData.length ? (
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>名称</th>
                                        <th>添加时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(mysqlData || []).map((item) => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.date}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="item-wrapper">
                <div className="item-title">Redis</div>
                <div className="item-main">
                    <div>
                        <label htmlFor="key">key:</label>
                        <input
                            id="key"
                            type="text"
                            value={redisKey}
                            onChange={(e) => setRedisKey(e.target.value)}
                        />
                        <label htmlFor="value">value:</label>
                        <input
                            id="value"
                            type="text"
                            value={redisValue}
                            onChange={(e) => setRedisValue(e.target.value)}
                        />
                        <button
                            style={{ marginLeft: 6 }}
                            disabled={
                                loading2 ||
                                (redisKey || "").trim() === "" ||
                                (redisValue || "").trim() === ""
                            }
                            onClick={async () => {
                                const key = (redisKey || "").trim();
                                const value = (redisValue || "").trim();
                                if (key) {
                                    try {
                                        setLoading2(true);
                                        await fetch(
                                            `./api/redis/set?${key}=${value}`
                                        );
                                        await fetchRedisKeys();
                                        alert("操作成功");
                                    } finally {
                                        setLoading2(false);
                                    }
                                }
                            }}
                        >
                            add
                        </button>
                    </div>
                    {(redisKeys || []).length ? (
                        <div style={{ marginTop: 10 }}>
                            <div style={{ fontWeight: "bold" }}>
                                All redis keys:
                            </div>
                            <div
                                style={{ padding: "4px 20px", color: "tomato" }}
                            >
                                {(redisKeys || []).join(",")}
                            </div>
                        </div>
                    ) : null}
                    <div style={{ marginTop: 10 }}>
                        <select
                            ref={selectRef}
                            style={{ width: 120 }}
                        >
                            {(redisKeys || []).map((it) => {
                                return (
                                    <option key={it} value={it}>
                                        {it}
                                    </option>
                                );
                            })}
                        </select>
                        <button
                            style={{ marginLeft: 6 }}
                            onClick={async () => {
                                const key = selectRef.current.value;
                                if (key) {
                                    fetch(`./api/redis/get/${key}`)
                                        .then((response) => {
                                            return response.json();
                                        })
                                        .then((data) => {
                                            const { result = "" } = data || {};
                                            setSearchResult({
                                                ...searchResult,
                                                [key]: result,
                                            });
                                        });
                                }
                            }}
                        >
                            search
                        </button>
                    </div>
                    {Object.keys(searchResult).length ? (
                        <div style={{ marginTop: 10 }}>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>key</th>
                                        <th>value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(searchResult).map((key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{key}</td>
                                                <td>{searchResult[key]}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="item-wrapper">
                <div className="item-title">MongoDB</div>
                <div className="item-main">
                    <div>
                        <input
                            type="text"
                            value={text3}
                            onChange={(e) => setText3(e.target.value)}
                        />
                        <button
                            style={{ marginLeft: 6 }}
                            disabled={loading3 || (text3 || "").trim() === ""}
                            onClick={async () => {
                                const value = (text3 || "").trim();
                                if (value) {
                                    try {
                                        setLoading3(true);
                                        await fetch(
                                            `./api/todo/insert?value=${value}`
                                        );
                                        fetchMongodbData();
                                    } finally {
                                        setLoading3(false);
                                    }
                                }
                            }}
                        >
                            add
                        </button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        {mongodbData && mongodbData.length ? (
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>subject</th>
                                        <th>datetime</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(mongodbData || []).map((item) => {
                                        return (
                                            <tr key={item._id}>
                                                <td>{item.subject}</td>
                                                <td>
                                                    {item.datetime
                                                        ? new Date(
                                                              item.datetime
                                                          ).toISOString()
                                                        : ""}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="item-wrapper">
                <div className="item-title">ElasticSearch</div>
                <div className="item-main">
                    <div>
                        {news.map((item, index) => {
                            return (
                                <button
                                    key={index}
                                    style={{ marginLeft: 6 }}
                                    onClick={() => {
                                        setTitle(item.title);
                                        setBody(item.body);
                                    }}
                                >
                                    复制文章{index + 1}到输入框
                                </button>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <div>标题：</div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <div>正文：</div>
                        <textarea
                            style={{ width: 400 }}
                            rows={8}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <button
                            style={{ marginLeft: 6 }}
                            disabled={
                                loading4 ||
                                (title || "").trim() === "" ||
                                (body || "").trim() === ""
                            }
                            onClick={async () => {
                                const titleValue = (title || "").trim();
                                const bodyValue = (body || "").trim();
                                if (titleValue && bodyValue) {
                                    try {
                                        setLoading4(true);
                                        await fetch(
                                            `./api/es/add?title=${titleValue}&body=${bodyValue}`
                                        );
                                    } finally {
                                        setLoading4(false);
                                    }
                                }
                            }}
                        >
                            add
                        </button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <input type="text" ref={inputRef} />
                        <select
                            ref={selectRef2}
                            style={{ width: 60, marginLeft: 6 }}
                        >
                            {[
                                { name: "标题", value: "title" },
                                { name: "正文", value: "body" },
                            ].map((it) => {
                                return (
                                    <option key={it.value} value={it.value}>
                                        {it.name}
                                    </option>
                                );
                            })}
                        </select>
                        <button
                            style={{ marginLeft: 6 }}
                            onClick={async () => {
                                const text = inputRef.current.value.trim();
                                const key = selectRef2.current.value;
                                if (text && key) {
                                    fetch(
                                        `./api/es/get?key=${key}&text=${text}`
                                    )
                                        .then((response) => {
                                            return response.json();
                                        })
                                        .then((data) => {
                                            const { body = {} } = data || {};
                                            setEsData(body);
                                        });
                                } else {
                                    setEsData({});
                                    alert("请输入要搜索的文字");
                                }
                            }}
                        >
                            search
                        </button>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        {esData && esData.hits && esData.hits.total
                            ? `共搜索到${esData.hits.total.value}篇文章`
                            : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
