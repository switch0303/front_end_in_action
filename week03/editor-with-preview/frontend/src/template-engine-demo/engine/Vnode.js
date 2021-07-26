export default class Vnode {
    constructor(tag, attrs, children, parent, childrenTemplate) {
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
        this.parent = parent;
        this.childrenTemplate = childrenTemplate;
        this.uuid = this.uuid();
    }

    uuid() {
        return (
            Math.random() * 10000000000 +
            Math.random() * 100000 +
            Date.now()
        ).toString(36);
    }
}
