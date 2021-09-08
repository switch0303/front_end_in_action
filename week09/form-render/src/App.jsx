import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

import Side from "./components/Side";
import Content from "./components/Content";

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
                    },
                    inputB: {
                        title: "输入框2",
                        type: "string",
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
                    <div className="setting-wrapper">setting</div>
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
                selectedId: $id,
            });
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
            this.setState({
                schema: newSchema,
                selectedId: $id,
            });
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
                    selectedId: transformedSchema[selectedIndex]
                        ? transformedSchema[selectedIndex].id
                        : "#",
                });
            }
        );
    };

    clearAll = () => {
        this.setState({
            schema: {
                type: "object",
                properties: {},
            },
        });
    };
}

export default App;
