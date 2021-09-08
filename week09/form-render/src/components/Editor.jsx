import React from "react";
import { Form } from "antd";
import Wrapper from "./Wrapper";
import { renderControler } from "./Previewer";

export default function Editor(props) {
    const { transformedSchema, globalState, actions } = props;

    return (
        <Wrapper id="#" isRoot globalState={globalState} actions={actions}>
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
                        const {
                            id,
                            ...schema
                        } = item;

                        const {
                            id: _id,
                            title,
                            type,
                            ...restProps
                        } = item;

                        return (
                            <Wrapper key={id} id={id} schema={schema} globalState={globalState} actions={actions}>
                                <Form.Item 
                                    label={item.title}
                                    name={item.id}
                                    valuePropName={item.type === "boolean" ? "checked" : "value"}
                                    {...restProps}
                                >
                                    {renderControler(item)}
                                </Form.Item>
                            </Wrapper>
                        );
                    })}
                </Form>
            ) : (
                <div className="h-100 flex justify-center items-center f4">点击/拖拽左侧栏的组件进行添加</div>
            )}
        </Wrapper>
    );
}
