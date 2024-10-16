import React from 'react';
import logo from './logo.svg';
import './App.css';
import Settings, { SettingsContext } from './settings';


export default function App() {
    const user_settings = React.useContext(SettingsContext);
    return (
        <div className="App">
            <Settings />
            <p>Hello World</p>
        </div>
    );
}
