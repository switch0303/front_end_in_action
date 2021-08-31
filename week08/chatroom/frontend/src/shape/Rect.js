import Shape from "./Shape.js";

export default class Rect extends Shape {
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
            const w = end.x - start.x;
            const h = end.y - start.y;
            context.strokeRect(start.x, start.y, w, h);
        });
    }

    syncData(shape) {
        this.shapes.push(shape);
    }

    sendData(shape) {
        this.socket.emit("draw", { shape: "Rect", data: shape });
    }
}
