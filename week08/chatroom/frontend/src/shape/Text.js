import Shape from "./Shape.js";

export default class Text extends Shape {
    constructor(context, rect, socket) {
        super(context, rect);
        this.socket = socket;
    }

    draw() {
        let { context, shapes } = this;
        context.font = "48px serif";
        shapes.forEach((shape) => {
            let start = shape[0];
            context.fillText("Text", start.x, start.y);
        });
    }

    syncData(shape) {
        this.shapes.push(shape);
    }

    sendData(shape) {
        this.socket.emit("draw", { shape: "Text", data: shape });
    }
}
