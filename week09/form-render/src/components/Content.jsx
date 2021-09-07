import React, { Component } from "react";
import { Form, Button } from "antd";
import "./Content.scss";

import Editor from "./Editor";
import Previewer from "./Previewer";

class Content extends Component {
    render() {
        const { globalState, actions } = this.props;
        const { schema, isEditMode } = globalState;

        const transformedSchema = this.getTransformedSchema(schema);

        return (
            <div className="Content">
                <div className="buttons-wrap">
                    <Button
                        onClick={() => {
                            actions.setGlobalState({ isEditMode: !isEditMode });
                        }}
                    >
                        {isEditMode ? "预览" : "编辑"}
                    </Button>
                </div>
                <div className="main-wrap">
                    {isEditMode ? (
                        <Editor transformedSchema={transformedSchema} />
                    ) : (
                        <Previewer transformedSchema={transformedSchema} />
                    )}
                </div>
            </div>
        );
    }

    getTransformedSchema = (schema) => {
        if (
            !schema ||
            !schema.type ||
            schema.type !== "object" ||
            !schema.properties
        ) {
            return [];
        } else {
            return Object.entries(schema.properties || {}).map(
                ([key, value]) => {
                    return {
                        ...value,
                        id: key,
                    };
                }
            );
        }
    };
}

export default Content;
