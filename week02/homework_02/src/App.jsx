import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import Home from "./Home";

import EditorDemo from "./editor-demo/EditorDemo";
import GrayScale from "./grayscale/GrayScale";

import TemplateEngineDemo from "./template-engine-demo/TemplateEngineDemo";

function App() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/editordemo">
                    <EditorDemo />
                </Route>
                <Route path="/grayscale">
                    <GrayScale />
                </Route>
                <Route path="/template_engine_demo">
                    <TemplateEngineDemo />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </HashRouter>
    );
}

export default App;
