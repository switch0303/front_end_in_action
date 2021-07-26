import Engine from "./Engine";

export default class EngineDOM {
    constructor() {
        this.root = null;
        this.engine = new Engine();
    }

    render(template, data, callback) {
        const dom = this.engine.render(template, data);
        this.root.appendChild(dom);
        if (typeof callback === "function") {
            callback();
        }
    }

    mounted(dom) {
        this.root = dom;
        return this;
    }
}
