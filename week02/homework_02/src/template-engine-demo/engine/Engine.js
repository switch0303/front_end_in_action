import Vnode from "./Vnode";

export default class Engine {
    constructor() {
        this.nodes = new Map();
    }

    render(template, data) {
        const transformedTpl = this.transformTemplate(template);
        console.log(
            "第一阶段|解析创建node>>>",
            this.nodes,
            "第一阶段|转换template>>>",
            transformedTpl
        );

        const rootNode = this.parseToNode(transformedTpl);
        console.log("第二阶段|构建nodeTree>>>", rootNode);

        const dom = this.parseNodeToDOM(rootNode, data);
        console.log("第三阶段|nodeTree To DOMTree>>>", dom);

        return dom;
    }

    transformTemplate(template) {
        const re1 = /<(\w+)\s*([^>]*)\s*>([^<]*)<\/\1>/g; // 匹配 如<div class="a">XXX</div>
        const re2 = /<(\w+)\s*([^(/>)]*)\s*\/>/g; // 匹配 如<img src="a"/>
        template = template.replace(/\n/g, "");
        // similar to post order traversal
        while (re1.test(template) || re2.test(template)) {
            // 替换 如<div class="a">XXX</div> 为 对应vnode的uuid
            template = template.replace(re1, (match, p1, p2, p3) => {
                const vnode = new Vnode(
                    p1,
                    this.parseAttribute(p2),
                    [],
                    null,
                    p3
                );
                this.nodes.set(vnode.uuid, vnode);
                return `(${vnode.uuid})`;
            });
            // 替换 如<img src="a"/> 为 对应vnode的uuid
            template = template.replace(re2, (match, p1, p2) => {
                const vnode = new Vnode(
                    p1,
                    this.parseAttribute(p2),
                    [],
                    null,
                    ""
                );
                this.nodes.set(vnode.uuid, vnode);
                return `(${vnode.uuid})`;
            });
        }
        return template;
    }

    parseAttribute(str) {
        const attrs = new Map();
        str = str.trim();
        // 匹配 class="a" calss='a' class=a disabled
        const reg =
            /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/g;
        str.replace(reg, (match, p1, p2, p3, p4) => {
            attrs.set(p1, p2 || p3 || p4 || true);
            return match;
        });
        return attrs;
    }

    parseToNode(template) {
        const reg = /\((.*?)\)/g;
        const queue = [];
        const root = new Vnode("root", null, [], null, template);
        queue.push(root);
        while (queue.length) {
            const parentNode = queue.shift();
            const childrenTpl = parentNode.childrenTemplate.trim();
            reg.lastIndex = 0;
            [...childrenTpl.matchAll(reg)].forEach((item) => {
                const node = this.nodes.get(item[1]);
                const newNode = new Vnode(
                    node.tag,
                    node.attrs,
                    [],
                    parentNode,
                    node.childrenTemplate
                );
                parentNode.children.push(newNode);
                queue.push(newNode);
            });
        }
        return root.children[0];
    }

    parseNodeToDOM(rootNode, data) {
        const fragment = document.createDocumentFragment();

        const queue = [[rootNode, fragment, data]];
        while (queue.length) {
            const [currentNode, parentDOM, scope] = queue.shift();
            const attrs = currentNode.attrs || new Map();
            if (attrs.get("v-if")) {
                console.log("v-if");
            } else {
                const childrenHtml = this.transformHtmlWithData(
                    currentNode.childrenTemplate,
                    data,
                    scope
                );
                const element = this.createElement(currentNode, childrenHtml, data, scope);
                parentDOM.appendChild(element);

                currentNode.children.forEach((child) => {
                    queue.push([child, element, scope]);
                });
            }
        }

        return fragment;
    }

    transformHtmlWithData(childrenTpl, globalScope, currentScope) {
        return childrenTpl.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, p1) => {
            const props = p1.split(".");
            let value = currentScope[props[0]] || globalScope[props[0]];
            props.slice(1).forEach((prop) => (value = value[prop]));
            return value;
        });
    }

    createElement(node, childrenHtml, globalScope, currentScope) {
        const element = document.createElement(node.tag);
        this.transformAttrsWithData(element, node, globalScope, currentScope);
        if (node.children.length === 0) {
            element.innerHTML = childrenHtml;
        }
        return element;
    }

    transformAttrsWithData(element, node, globalScope, currentScope) {
        const ignoreAttrs = ["v-if"];
        for (let [key, value] of node.attrs) {
            if (!ignoreAttrs.includes(key)) {
                const result = /\{\{(.*?)\}\}/.exec(value);
                if (result && result.length > 0) {
                    const props = result[1].split(".");
                    let val = currentScope[props[0]] || globalScope[props[0]];
                    props.slice(1).forEach((prop) => {
                        val = val[prop];
                    });
                    element.setAttribute(key, val);
                } else {
                    element.setAttribute(key, value);
                }
            }
        }
    }
}
