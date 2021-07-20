import Engine from "./Engine";

export default class EngineDOM {
    constructor() {
        this.root = null;
        this.engine = new Engine();
    }

    render(template, data) {
        const dom = this.engine.render(template, data);
        this.root.appendChild(dom);
    }

    mounted(dom) {
        this.root = dom;
        return this;
    }
}
