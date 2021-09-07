import React from "react";
import { Form, Input, InputNumber } from "antd";
import Wrapper from "./Wrapper";

const renderControler = (item) => {
    const { type } = item;
    if (type === "string") {
        return <Input />;
    } else if (type === "number") {
        return <InputNumber style={{ width: "100%" }} />;
    }
};

export default function Editor(props) {
    const { transformedSchema } = props;

    return (
        <Wrapper>
            {Array.isArray(transformedSchema) && transformedSchema.length ? (
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
                            <Wrapper key={item.id}>
                                <Form.Item label={item.title} name={item.id}>
                                    {renderControler(item)}
                                </Form.Item>
                            </Wrapper>
                        );
                    })}
                </Form>
            ) : (
                <div>点击/拖拽左侧栏的组件进行添加</div>
            )}
        </Wrapper>
    );
}
