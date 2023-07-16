import classNames from "classnames";
import { StrictMode, useCallback, useState } from "react";
import { Classes } from "@blueprintjs/core";
import { Navigation } from "./Navigation";
import { ForceGraphExample } from "./ForceGraphExample";

function App() {

    return (
        <div
            className={classNames("app", {
                [Classes.DARK]: true
            })}
        >
            <Navigation />
            <div className="examples-container">
                <ForceGraphExample />
            </div>

        </div>
    );
}

export default App;
