import Shape from "./Shape.js";

export default class Line extends Shape {
    constructor(context, rect, socket) {
        super(context, rect);
        this.socket = socket;
    }

    draw() {
        let { context, style, shapes } = this;
        context.strokeStyle = "#" + style.color;
        context.lineWidth = style.lineWidth;

        shapes.forEach((shape) => {
            let start = shape[0];
            let end = shape[shape.length - 1];
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
            context.closePath();
        });
    }

    syncData(shape) {
        this.shapes.push(shape);
    }

    sendData(shape) {
        this.socket.emit("draw", { shape: "Line", data: shape });
    }
}
