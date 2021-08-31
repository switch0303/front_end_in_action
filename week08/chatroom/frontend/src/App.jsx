import React, { Component, createRef } from "react";
// import { throttle } from "./util/Util.js";

import ToolBar from "./ToolBar";
import { Pen } from "./shape";

import "./App.scss";

function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
        var time = new Date().getTime();
        if (time - previousCall >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}

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
};
let SHAPE_INSTANCES = new Map();

class App extends Component {
    constructor(...arg) {
        super(...arg);
        this.state = {
            selectedTool: "pen",
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
                />
                <div className="canvas-container">
                    <canvas ref={this.canvasRef} />
                </div>
            </div>
        );
    }

    changeSelectedTool = (tool) => {
        this.setState({ selectedTool: tool });
        this.setShapeInstance(tool);
    };

    setShapeInstance = (tool) => {
        if (!SHAPE_INSTANCES.has(tool)) {
            const className = tool.replace(/^(\w)/, (match, p1) =>
                p1.toUpperCase()
            );
            const rect = this.canvasRef.current.getBoundingClientRect();
            this.shapeInstance = new SHAPES[className](
                this.context,
                rect,
                this.socket
            );
            SHAPE_INSTANCES.set(tool, this.shapeInstance);
        } else {
            this.shapeInstance = SHAPE_INSTANCES.get(tool);
        }
    };

    setUpScoket = () => {
        this.socket = io();
        this.socket.on("connect", () => {
            console.log("Connected to server");
        });
        this.socket.on("draw", (data) => {
            console.log("data", data);
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

        context.clearRect(0, 0, width, height);
        this.context = context;

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
            throttle((evt) => {
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

    draw = () => {
        if (Date.now() - this.startTime > 20) {
            this.context.clearRect(0, 0, this.width, this.height);
            for (let [tool, instance] of SHAPE_INSTANCES) {
                instance.draw();
            }
            this.startTime = Date.now();
        }
        window.requestAnimationFrame(this.draw);
    };
}

export default App;
