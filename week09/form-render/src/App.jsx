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
        };
    }

    render() {
        const globalState = { ...this.state };
        const actions = {
            setGlobalState: this.setGlobalState,
            addSchema: this.addSchema,
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

    addSchema = (schemaItem) => {
        const { schema } = this.state;
        this.setState({
            schema: {
                ...schema,
                properties: {
                    ...schema.properties,
                    ...schemaItem,
                },
            },
        });
    };
}

export default App;
