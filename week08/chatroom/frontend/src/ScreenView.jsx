import React, {Component, createRef} from "react";

export default class ScreenView extends Component {
    constructor(...arg) {
        super(...arg);
        this.width = 0;
        this.height = 0;
        this.canvasRef = createRef();
    }

    componentDidMount() {
        this.setUpCanvas();
        this.props.socket.on("screenSharing", this.drawImg);
    }

    componentWillUnmount() {
        this.drawImg = null;
    }

    render() {
        const {
            onBack,
        } = this.props;

        return (
            <div style={{position: "absolute", left: 0, top: 0, backgroundColor: "#fff", width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
                <div style={{height: 60, padding: "0 10px", borderBottom: "1px solid #ccc", flex: "none", display: "flex", alignItems: "center"}}>
                    <span
                        className="btn"
                        onClick={onBack}
                    >
                        关闭
                    </span>
                </div>
                <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <canvas ref={this.canvasRef} style={{width: 800, height: 600}} />
                </div>
            </div>
        )
    }

    setUpCanvas = () => {
        const canvas = this.canvasRef.current;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        this.width = width;
        this.height = height;
        let context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        this.context = context;
    }

    drawImg = (data) => {
        console.log(1);
        if (data && this.canvasRef && this.canvasRef.current) {
            console.log(2);
            const img = new Image();
            img.src = data;
            img.onload = () => {
                this.context.drawImage(img, 0, 0, this.width, this.height);
            }
        }
    }
};
