import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import EditorDemo from "./editor-demo/EditorDemo";
import GrayScale from "./grayscale/GrayScale";
import Home from "./Home";

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
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </HashRouter>
    );
}

export default App;
