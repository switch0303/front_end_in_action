import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

import { defaultCommonSettings } from "./settings";

import Side from "./components/Side";
import Content from "./components/Content";
import Setting from "./components/Setting";

class App extends Component {
    constructor(...arg) {
        super(...arg);
        this.state = {
            schema: {
                type: "object",
                properties: {
                    inputA: {
                        title: "输入框1",
                        type: "string",
                        required: true,
                        initialValue: "default text"
                    },
                    name: {
                        title: "姓名",
                        type: "string",
                        placeholder: "请输入姓名"
                    },
                },
            },
            isEditMode: true,
            selectedId: "#",
        };
    }

    render() {
        const globalState = { ...this.state };
        const actions = {
            setGlobalState: this.setGlobalState,
            addSchema: this.addSchema,
            moveSchema: this.moveSchema,
            deleteSchema: this.deleteSchema,
            clearAll: this.clearAll,
            getTransformedSchema: this.getTransformedSchema,
            getDisplaySchemaString: this.getDisplaySchemaString,
            getSelectedSetting: this.getSelectedSetting,
            getSelectedSchemaItem: this.getSelectedSchemaItem,
            setSelectedId: this.setSelectedId,
            updateSchema: this.updateSchema,
        };

        return (
            <DndProvider backend={HTML5Backend}>
                <div className="App">
                    <div className="side-wrapper">
                        <Side globalState={globalState} actions={actions} />
                    </div>
                    <div className="content-wrapper">
                        <Content globalState={globalState} actions={actions} />
                    </div>
                    <div className="setting-wrapper">
                        <Setting globalState={globalState} actions={actions} />
                    </div>
                </div>
            </DndProvider>
        );
    }

    setGlobalState = (obj) => {
        this.setState({
            ...this.state,
            ...obj,
        });
    };

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

    getDisplaySchemaString = (schema) => {
        let displaySchemaString = "";
        try {
            displaySchemaString = JSON.stringify(schema, null, 4);
        } catch (e) {
            console.log(e);
        }
        return displaySchemaString;
    };

    addSchema = ({ position, targetId, item }) => {
        const { schema } = this.state;
        const { $id, schemaItem } = item;
        if (position === "inside" && targetId === "#") {
            this.setState({
                schema: {
                    ...schema,
                    properties: {
                        ...schema.properties,
                        [$id]: schemaItem,
                    },
                },
            });
            this.setSelectedId($id);
        } else {
            const transformedSchema = this.getTransformedSchema(schema);
            const findIndex = transformedSchema.findIndex(
                (it) => it.id === targetId
            );
            let insertIndex = transformedSchema.length;
            if (findIndex !== -1) {
                insertIndex = position === "up" ? findIndex : findIndex + 1;
            }
            transformedSchema.splice(insertIndex, 0, {
                id: $id,
                ...schemaItem,
            });
            const newSchema = {
                ...schema,
                properties: {},
            };
            transformedSchema.forEach((it) => {
                const { id, ...schemaItem } = it;
                newSchema.properties[id] = schemaItem;
            });
            this.setState(
                {
                    schema: {
                        type: "object",
                        properties: {},
                    },
                    selectedId: "#",
                },
                () => {
                    this.setState({
                        schema: newSchema,
                        selectedId: $id,
                    });
                }
            );
        }
    };

    moveSchema = ({ position, targetId, item }) => {
        const { schema } = this.state;
        const { $id, schemaItem } = item;
        const transformedSchema = this.getTransformedSchema(schema);
        const deleteIndex = transformedSchema.findIndex((it) => it.id === $id);
        if (deleteIndex !== -1) {
            transformedSchema.splice(deleteIndex, 1);
        }
        let insertIndex = transformedSchema.length;
        if (targetId !== "#") {
            const findIndex = transformedSchema.findIndex(
                (it) => it.id === targetId
            );
            if (findIndex !== -1) {
                insertIndex = position === "up" ? findIndex : findIndex + 1;
            }
        }
        transformedSchema.splice(insertIndex, 0, {
            id: $id,
            ...schemaItem,
        });
        const newSchema = {
            ...schema,
            properties: {},
        };
        transformedSchema.forEach((it) => {
            const { id, ...schemaItem } = it;
            newSchema.properties[id] = schemaItem;
        });
        this.setState({
            schema: newSchema,
        });
    };

    deleteSchema = ({ $id }) => {
        const { schema } = this.state;
        const transformedSchema = this.getTransformedSchema(schema);
        const deleteIndex = transformedSchema.findIndex((it) => it.id === $id);
        let selectedIndex = 0;
        if (deleteIndex !== -1) {
            transformedSchema.splice(deleteIndex, 1);
            if (deleteIndex > 0) {
                selectedIndex = deleteIndex - 1;
            }
        }
        const newSchema = {
            ...schema,
            properties: {},
        };
        transformedSchema.forEach((it) => {
            const { id, ...schemaItem } = it;
            newSchema.properties[id] = schemaItem;
        });

        const newSelectedId = transformedSchema[selectedIndex]
            ? transformedSchema[selectedIndex].id
            : "#";
        console.log(selectedIndex, newSelectedId)
        this.setState(
            {
                schema: {
                    type: "object",
                    properties: {},
                },
                selectedId: "#",
            },
            () => {
                this.setState({
                    schema: newSchema,
                    selectedId: newSelectedId,
                });
            }
        );
    };

    updateSchema = ({$id, obj}) => {
        const { schema } = this.state;
        const transformedSchema = this.getTransformedSchema(schema);
        const updateIndex = transformedSchema.findIndex((it) => it.id === $id);
        if (updateIndex !== -1) {
            transformedSchema[updateIndex] = {...transformedSchema[updateIndex], ...obj};
            const newSchema = {
                ...schema,
                properties: {},
            };
            transformedSchema.forEach((it) => {
                const { id, ...schemaItem } = it;
                newSchema.properties[id] = schemaItem;
            });
            this.setState(
                {
                    schema: {
                        type: "object",
                        properties: {},
                    },
                },
                () => {
                    this.setState({
                        schema: newSchema,
                    });
                }
            );
            if ("id" in obj) {
                this.setSelectedId(obj.id);
            }
        }
    };

    clearAll = () => {
        this.setState({
            schema: {
                type: "object",
                properties: {},
            },
        });
    };

    getSelectedSetting = () => {
        const {schema, selectedId} = this.state;
        if (
            !schema ||
            !schema.type ||
            schema.type !== "object" ||
            !schema.properties ||
            !schema.properties[selectedId]
        ) {
            return null;
        } else {
            const schemaItem = schema.properties[selectedId];
            if (schemaItem.type === "boolean") {
                const {
                    placeholder,
                    initialValue,
                    ...rest
                } = defaultCommonSettings;
                return {
                    type: "object",
                    properties: {
                        ...rest,
                        initialValue: {
                            title: "是否默认勾选",
                            type: "boolean",
                        },
                    },
                };
            }
            return {
                type: "object",
                properties: defaultCommonSettings,
            };
        }
    };

    getSelectedSchemaItem = () => {
        const { schema, selectedId } = this.state;
        const transformedSchema = this.getTransformedSchema(schema);
        const findItem = transformedSchema.find(
            (it) => it.id === selectedId
        );
        return findItem;
    };

    setSelectedId = (selectedId) => {
        this.setState({
            selectedId: "#",
        }, () => {
            this.setState({
                selectedId,
            });
        });
    };
}

export default App;
