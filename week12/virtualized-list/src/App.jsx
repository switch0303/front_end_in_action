import { useCallback, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import faker from "faker";
import { css } from "@emotion/css";
import { InputNumber, Button } from "antd";
import "./App.css";
import VirtualizedList from "./component/v-list/VirtualizedList";

const sentences = new Array(100).fill(0).map((item) => faker.lorem.sentences());

function App() {
    const [dataSize, setDataSize] = useState(10000);
    const [scrollTop, setScrollTop] = useState(1000 * 90);
    const vListRef = useRef();
    // console.time();
    const data = useMemo(() => {
        return new Array(Math.ceil(dataSize)).fill(0).map((item, index) => {
            return {
                id: index,
                // value: faker.lorem.sentences(),
                value: sentences[Math.floor(Math.random() * 100)],
            };
        });
    }, [dataSize]);
    // console.timeEnd();
    const rowRender = useCallback(
        (index) => {
            const item = data[index];
            if (!item) {
                return null;
            }
            const { id, value } = item;
            return (
                <div
                    key={id}
                    id={index} // 重要：id传入index，VirtualizedList才能根据index来更新CachedPositions
                    className={css`
                        box-sizing: border-box;
                        width: 100%;
                        padding: 20px;
                        border-bottom: 1px solid #333;
                    `}
                >
                    <div
                        className={css`
                            font-size: 16px;
                            font-weight: bold;
                            color: #333;
                        `}
                    >
                        Item {index}:
                    </div>
                    <div
                        className={css`
                            font-size: 14px;
                            color: #999;
                        `}
                    >
                        {value}
                    </div>
                </div>
            );
        },
        [data]
    );

    return (
        <div className="App">
            <div
                style={{
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div>
                    <span>列表项数量：</span>
                    <InputNumber
                        min={0}
                        precision={0}
                        value={dataSize}
                        onChange={(value) => setDataSize(value)}
                    />
                </div>
                <div style={{ marginLeft: 20 }}>
                    <span>跳转至：</span>
                    <InputNumber
                        min={0}
                        precision={0}
                        value={scrollTop}
                        onChange={(value) => setScrollTop(value)}
                    />
                    <span style={{ margin: "0 10px 0 4px" }}>px</span>
                    <Button
                        type="primary"
                        onClick={() => {
                            if (typeof scrollTop === "number") {
                                vListRef.current.scrollTo(scrollTop);
                            } else {
                                alert("非法输入");
                            }
                        }}
                    >
                        确定跳转
                    </Button>
                </div>
            </div>
            <div style={{ width: 500, height: 800, border: "1px solid #ccc" }}>
                <VirtualizedList
                    ref={vListRef}
                    rows={data.length}
                    height={800}
                    estimatedRowHeight={90}
                    bufferSize={5}
                    rowRender={rowRender}
                />
            </div>
        </div>
    );
}

export default App;
