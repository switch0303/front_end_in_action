import React, { Component } from "react";
import { Form, Input, InputNumber, Checkbox } from "antd";

const { TextArea } = Input;

export const renderControler = (item) => {
    const { type, format, title, id, tooltip, initialValue, required, ...restProps } = item;
    if (type === "string") {
        if (format === "textarea") {
            return <TextArea {...restProps} />;
        }
        return <Input {...restProps} />;
    } else if (type === "number") {
        return <InputNumber style={{ width: "100%" }} {...restProps} />;
    } else if (type === "boolean") {
        return <Checkbox {...restProps} />;
    }
};
class Previewer extends Component {
    render() {
        const { transformedSchema } = this.props;
        if (Array.isArray(transformedSchema) && transformedSchema.length) {
            return (
                <Form
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    onValuesChange={(changedValues, allValues) => {
                        console.log("changedValues", changedValues);
                        console.log("allValues", allValues);
                    }}
                >
                    {transformedSchema.map((item) => {
                        const {
                            id,
                            title,
                            type,
                            ...restProps
                        } = item;
                        return (
                            <Form.Item
                                key={item.id}
                                label={item.title}
                                name={item.id}
                                valuePropName={
                                    item.type === "boolean"
                                        ? "checked"
                                        : "value"
                                }
                                {...restProps}
                            >
                                {renderControler(item)}
                            </Form.Item>
                        );
                    })}
                </Form>
            );
        } else {
            return null;
        }
    }
}

export default Previewer;
