import Shape from "./Shape.js";

export default class Ellipse extends Shape {
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

            const h = end.y - start.y;
            const hh = h / 2;

            context.beginPath();
            context.moveTo(start.x, start.y);
            context.bezierCurveTo(
                start.x,
                start.y - hh,
                end.x,
                start.y - hh,
                end.x,
                start.y
            );
            context.bezierCurveTo(
                end.x,
                start.y + hh,
                start.x,
                start.y + hh,
                start.x,
                start.y
            );
            context.closePath();
            context.stroke();
        });
    }

    syncData(shape) {
        this.shapes.push(shape);
    }

    sendData(shape) {
        this.socket.emit("draw", { shape: "Ellipse", data: shape });
    }
}
