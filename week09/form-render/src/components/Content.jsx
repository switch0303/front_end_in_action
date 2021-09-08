import React, { Component } from "react";
import copyToClipboard from "copy-text-to-clipboard";
import { Button, Modal, Input, message } from "antd";
import "./Content.scss";

import Editor from "./Editor";
import Previewer from "./Previewer";

const { TextArea } = Input;
class Content extends Component {
    constructor(...arg) {
        super(...arg);
        this.state = {
            shouldShowExportModal: false,
        };
    }
    render() {
        const { globalState, actions } = this.props;
        const { schema, isEditMode } = globalState;
        const { shouldShowExportModal } = this.state;

        const transformedSchema = actions.getTransformedSchema(schema);
        const displaySchemaString = actions.getDisplaySchemaString(schema);

        return (
            <div className="Content">
                <div className="buttons-wrap">
                    <Button
                        className="mr2"
                        onClick={() => {
                            actions.setGlobalState({ isEditMode: !isEditMode });
                        }}
                    >
                        {isEditMode ? "预览" : "编辑"}
                    </Button>
                    <Button
                        className="mr2"
                        onClick={() => {
                            actions.clearAll();
                        }}
                    >
                        清空
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            this.setState({ shouldShowExportModal: true });
                        }}
                    >
                        导出Schema
                    </Button>
                </div>
                <div className="main-wrap">
                    {isEditMode ? (
                        <Editor
                            transformedSchema={transformedSchema}
                            globalState={globalState}
                            actions={actions}
                        />
                    ) : (
                        <Previewer transformedSchema={transformedSchema} />
                    )}
                </div>
                <Modal
                    visible={shouldShowExportModal}
                    closable={false}
                    onOk={() => {
                        copyToClipboard(displaySchemaString);
                        message.info("复制成功");
                        this.setState({ shouldShowExportModal: false });
                    }}
                    onCancel={() =>
                        this.setState({ shouldShowExportModal: false })
                    }
                    okText="复制"
                    cancelText="取消"
                >
                    <div className="mt3">
                        <TextArea
                            style={{ fontSize: 12 }}
                            value={displaySchemaString}
                            autoSize={{ minRows: 10, maxRows: 30 }}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Content;
