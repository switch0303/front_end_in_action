import React, {Component, createRef} from "react";

export default class ScreenShare extends Component {
    constructor(...arg) {
        super(...arg);
        this.width = 0;
        this.height = 0;
        this.videoRef = createRef();
    }

    async componentDidMount() {
        try {
            let stream = await window.navigator.mediaDevices.getDisplayMedia();

            const screen = this.videoRef.current;
            this.width = screen.offsetWidth;
            this.height = screen.offsetHeight;
            const {socket} = this.props;

            screen.addEventListener("loadeddata", event => {
                console.log("loaded");
                const canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext("2d");

                this.interval = setInterval(() => {
                    this.context.drawImage(screen, 0, 0, this.width, this.height);
                    const dataURL = canvas.toDataURL("images/jpeg", 0.2);
                    if (socket) {
                        socket.emit("screenSharing", dataURL);
                    }
                }, 100);
            });

            screen.srcObject = stream;
            screen.play();

        } catch (error) {
            console.log(error);
            this.props.onBack();
        }
    }

    componentWillUnmount() {
        const screen = this.videoRef.current;
        if (screen && screen.srcObject) {
            let tracks = screen.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            screen.srcObject = null;
        }
        if (this.interval) {
            clearInterval(this.interval);
        }
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
                        停止并返回
                    </span>
                </div>
                <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <video ref={this.videoRef} style={{width: 800, height: 600}} />
                </div>
            </div>
        )
    }
};
