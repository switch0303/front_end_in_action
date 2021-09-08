export const defaultCommonSettings = {
    id: {
        title: "ID",
        tooltip: "字段名称/英文",
        type: "string",
        widget: "idInput",
        required: true,
    },
    title: {
        title: "标题",
        type: "string",
    },
    tooltip: {
        title: "提示文字",
        type: "string",
    },
    initialValue: {
        title: "默认值",
        type: "string",
    },
    required: {
        title: "必填",
        type: "boolean",
    },
    placeholder: {
        title: "占位符",
        type: "string",
    },
    disabled: {
        title: "禁用",
        type: "boolean",
    },
};

const baseElements = [
    {
        text: "输入框",
        name: "input",
        schema: {
            title: "输入框",
            type: "string",
        },
        setting: {},
    },
    {
        text: "文本输入框",
        name: "textarea",
        schema: {
            title: "文本输入框",
            type: "string",
            format: "textarea",
        },
        setting: {},
    },
    {
        text: "数字输入框",
        name: "number",
        schema: {
            title: "数字输入框",
            type: "number",
        },
        setting: {},
    },
    {
        text: "是否选择",
        name: "checkbox",
        schema: {
            title: "是否选择",
            type: "boolean",
        },
        setting: {
            initialValue: {
                title: "是否默认勾选",
                type: "boolean",
            },
        },
    },
];

export const defaultSettings = [
    {
        title: "基础组件",
        widgets: baseElements,
    },
];
