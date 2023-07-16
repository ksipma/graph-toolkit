import { createRoot } from 'react-dom/client';
import App from "./App";

import { FocusStyleManager } from "@blueprintjs/core";

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./main.css";

FocusStyleManager.onlyShowFocusOnTabs();


const container = document.getElementById("root")
const root = createRoot(container);
root.render(<App />);
