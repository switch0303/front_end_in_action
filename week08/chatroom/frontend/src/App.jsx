import React, { Component, createRef } from "react";
 import Util from "./util/Util.js";

import ToolBar from "./ToolBar";
import ScreenShare from "./ScreenShare";
import ScreenView from "./ScreenView";
import { Pen, Line, Text, Rect, Circle, Ellipse } from "./shape";

import "./App.scss";

const tools = [
    { name: "pen", text: "钢笔" },
    { name: "line", text: "直线" },
    { name: "text", text: "文字" },
    { name: "rect", text: "矩形" },
    { name: "circle", text: "圆形" },
    { name: "ellipse", text: "椭圆" },
];

const SHAPES = {
    Pen,
    Line,
    Text,
    Rect,
    Circle,
    Ellipse,
};
let SHAPE_INSTANCES = new Map();

class App extends Component {
    constructor(...arg) {
        super(...arg);
        this.state = {
            selectedTool: "pen",

            shouldShowScreenShare: false,
            shouldShowScreenView: false,
        };
        this.canvasRef = createRef();
        this.width = 0;
        this.height = 0;
        this.startTime = 0;
        this.shapeInstance = null;
    }
    componentDidMount() {
        this.setUpScoket();
        this.setUpCanvas();
        tools.forEach(tool => this.setShapeInstance(tool.name));
        this.setShapeInstance(this.state.selectedTool);
        this.draw();
    }

    render() {
        return (
            <div className="main-container">
                <ToolBar
                    tools={tools}
                    selectedTool={this.state.selectedTool}
                    onChange={this.changeSelectedTool}
                    onClearAll={this.onClearAll}
                    onScreenShare={this.onScreenShare}
                />
                <div className="canvas-container">
                    <canvas ref={this.canvasRef} />
                </div>

                {
                    this.state.shouldShowScreenShare
                        ? (
                            <ScreenShare
                                onBack={() => {
                                    this.setState({shouldShowScreenShare: false});
                                }}
                                socket={this.socket}
                            />
                        )
                        : null
                }

                {
                    this.state.shouldShowScreenView
                        ? (
                            <ScreenView
                                onBack={() => {
                                    this.setState({shouldShowScreenView: false});
                                }}
                                socket={this.socket}
                            />
                        )
                        : null
                }
            </div>
        );
    }

    changeSelectedTool = (tool) => {
        this.setState({ selectedTool: tool }, () => {
            this.setShapeInstance(tool);
        });
    };

    setShapeInstance = (tool) => {
        const shape = tool.replace(/^(\w)/, (match, p1) =>
            p1.toUpperCase()
        );
        if (!SHAPE_INSTANCES.has(shape)) {
            const rect = this.canvasRef.current.getBoundingClientRect();
            this.shapeInstance = new SHAPES[shape](
                this.getContext(),
                rect,
                this.socket
            );
            SHAPE_INSTANCES.set(shape, this.shapeInstance);
        } else {
            this.shapeInstance = SHAPE_INSTANCES.get(shape);
        }
    };

    setUpScoket = () => {
        this.socket = io();
        this.socket.on("connect", () => {
            console.log("Connected to server");
        });
        this.socket.on("draw", (data) => {
            console.log("data", data);
            for (let [shape, instance] of SHAPE_INSTANCES) {
                if (shape === data.shape) {
                  instance.syncData(data.data);
                }
            }
        });
        this.socket.on("clearAll", (data) => {
            this.clearAll();
        });

        this.socket.on("screenSharing", data => {
            this.confirmReceiveShare();
        });
    };

    setUpCanvas = () => {
        const canvas = this.canvasRef.current;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        this.width = width;
        this.height = height;

        let context = canvas.getContext("2d");

        context.imageSmoothingEnabled = true;

        // const devicePixelRatio = window.devicePixelRatio || 1;
        // const backingStoreRatio =
        //     context.webkitBackingStorePixelRatio ||
        //     context.mozBackingStorePixelRatio ||
        //     context.msBackingStorePixelRatio ||
        //     context.oBackingStorePixelRatio ||
        //     context.backingStorePixelRatio ||
        //     1;
        // let ratio = devicePixelRatio / backingStoreRatio;
        // canvas.width = width * ratio;
        // canvas.height = height * ratio;
        // context.scale(ratio, ratio);

        canvas.width = width;
        canvas.height = height;

        context.clearRect(0, 0, width, height);
        // this.context = context;

        canvas.addEventListener(
            "mousedown",
            (evt) => {
                if (!this.shapeInstance) return;
                this.shapeInstance.mousedown.apply(this.shapeInstance, [evt]);
            },
            false
        );
        canvas.addEventListener(
            "mousemove",
            Util.throttle((evt) => {
                if (!this.shapeInstance) return;
                this.shapeInstance.mousemove.apply(this.shapeInstance, [evt]);
            }, 30),
            false
        );
        canvas.addEventListener(
            "mouseup",
            (evt) => {
                if (!this.shapeInstance) return;
                this.shapeInstance.mouseup.apply(this.shapeInstance, [evt]);
            },
            false
        );
    };

    getContext = () => {
        return this.canvasRef.current.getContext("2d");
    }

    draw = () => {
        if (Date.now() - this.startTime > 20) {
            this.getContext().clearRect(0, 0, this.width, this.height);
            for (let [tool, instance] of SHAPE_INSTANCES) {
                instance.draw();
            }
            this.startTime = Date.now();
        }
        window.requestAnimationFrame(this.draw);
    };

    onClearAll = () => {
        this.clearAll();
        this.socket.emit("clearAll");
    }

    clearAll = () => {
        this.getContext().clearRect(0, 0, this.width, this.height);
        for (let [shape, instance] of SHAPE_INSTANCES) {
            instance.clearAll();
        }
    }

    onScreenShare = () => {
        this.setState({
            shouldShowScreenShare: true,
        });
    }

    confirmReceiveShare = () => {
        if (!this.asking && !this.ignoreScreenSharing && !this.state.shouldShowScreenView) {
            this.asking = true;
            const res = window.confirm("有人正在分享屏幕，是否查看？");
            if (res) {
                this.setState({
                    shouldShowScreenView: true,
                }, () => this.asking = false);
            } else {
                this.ignoreScreenSharing = true;
                this.asking = false;
            }
        }
    }
}

export default App;
