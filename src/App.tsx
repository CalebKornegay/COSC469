import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Settings from "./settings";
import Tests from "./views/tests";
import styled from "styled-components";

const Main = styled.div<{ bgcolor: string }>`
    background-color: ${(props) => props.bgcolor};
    transition: background-color 0.6s cubic-bezier(0.65, 0, 0.35, 1);
    height: 100vh;
`;

export default function App() {
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [color, setColor] = React.useState("#333");
    return (
        <div className="App">
            <Main bgcolor={color}>
                <div className="AppHeader">
                    ApeBehavior
                </div>
                <Settings settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen}/>

                {
                    settingsOpen ? null :
                    <Tests colorUpdateFunction={setColor} />
                }
            </Main>
        </div>
    );
}
