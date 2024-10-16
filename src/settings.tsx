import React from 'react';

export type UserSettings = {
    APIKey: string | undefined,
    runtype: string | undefined,
};

export const SettingsContext = React.createContext<UserSettings>({APIKey: undefined, runtype: undefined});

export default function Settings() {
    const user_settings = React.useContext(SettingsContext);
    const [settingsOpen, setSettingsOpen] = React.useState(false);

    return (
        <div className="SettingsDropdown">
            <button onClick={() => setSettingsOpen(!settingsOpen)}>Settings</button>
            {settingsOpen ? 
            <p>Hello</p>
            : null}
            {/* <input name="api_input" id="api_input" type="text" value={user_settings.APIKey}>Enter your ChatGPT API Key: </input> */}
        </div>
    );
}
