import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Settings from "./settings";
import Tests from "./views/tests";

export default function App() {
    return (
        <div className="App">
            <Settings />
            <div className="AppHeader">
                ApeBehavior
            </div>

            <Tests />
        </div>
    );
}
