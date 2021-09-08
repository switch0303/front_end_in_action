import React from "react";
import { Form, Button } from "antd";
import { renderControler } from "./Previewer";

export default function Setting(props) {
    const { globalState, actions } = props;

    const selectedSetting = actions.getSelectedSetting();
    const transformedSettingSchema =
        actions.getTransformedSchema(selectedSetting);

    if (
        Array.isArray(transformedSettingSchema) &&
        transformedSettingSchema.length
    ) {
        const selectedSchemaItem = actions.getSelectedSchemaItem();
        const { type, props: schemaItemProps, ...rest } = selectedSchemaItem;
        return (
            <Form
                layout="vertical"
                initialValues={{
                    ...rest,
                }}
                // onValuesChange={(changedValues, allValues) => {
                //     console.log("changedValues", changedValues);
                //     // console.log("allValues", allValues);
                //     actions.updateSchema({$id: rest.id, obj: changedValues});
                // }}
                onFinishFailed={(errorInfo) => {
                    console.log(errorInfo);
                }}
                onFinish={(values) => {
                    console.log(values);
                    const obj = {};
                    for (let key in values) {
                        if (values[key] !== undefined) {
                            obj[key] = values[key];
                        }
                    }
                    actions.updateSchema({$id: rest.id, obj});
                }}
            >
                {transformedSettingSchema.map((item) => {
                    const {
                        id,
                        title,
                        type,
                        ...restProps
                    } = item;
                    return (
                        <Form.Item
                            key={item.title}
                            label={item.title}
                            name={item.id}
                            valuePropName={item.type === "boolean" ? "checked" : "value"}
                            {...restProps}
                        >
                            {renderControler(item)}
                        </Form.Item>
                    );
                })}
                <div className="flex justify-center">
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        保存
                    </Button>
                </div>
            </Form>
        );
    } else {
        return <div className="tc">暂无配置</div>;
    }
}
