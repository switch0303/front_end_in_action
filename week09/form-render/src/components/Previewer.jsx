import React, { Component } from "react";
import { Form, Input, InputNumber } from "antd";

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
                >
                    {transformedSchema.map((item) => {
                        return (
                            <Form.Item
                                key={item.id}
                                label={item.title}
                                name={item.id}
                            >
                                {this.renderControler(item)}
                            </Form.Item>
                        );
                    })}
                </Form>
            );
        } else {
            return null;
        }
    }

    renderControler = (item) => {
        const { type } = item;
        if (type === "string") {
            return <Input />;
        } else if (type === "number") {
            return <InputNumber style={{width: "100%"}} />;
        }
    };
}

export default Previewer;
