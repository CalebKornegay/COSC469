import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Settings, { SettingsContext } from "./settings";
import Tests from "./views/tests";

export default function App() {
  const user_settings = React.useContext(SettingsContext);
  return (
    <div className="App">
      <Settings />
      <div className="AppHeader">
        <p>APeBEhavior</p>
      </div>

      <Tests />
    </div>
  );
}
