import React from 'react';

export type UserSettings = {
    APIKey: string | undefined,
    runtype: string | undefined,
};

export const SettingsContext = React.createContext<UserSettings>({APIKey: undefined, runtype: undefined});

export default function Settings() {
    const user_settings = React.useContext(SettingsContext);
    const [settingsOpen, setSettingsOpen] = React.useState(false);

    React.useEffect(() => {
        if (user_settings?.APIKey) {
            localStorage.setItem("api_key", user_settings.APIKey ?? "undefined");
        } else {
            localStorage.getItem("api_key");
        }
    },
    [user_settings])

    return (
        <div className="SettingsDropdown">
            <button onClick={() => setSettingsOpen(!settingsOpen)}>Settings</button>
            {settingsOpen ? 
            <div className='APIInput'>
            <label>Enter your ChatGPT API Key: </label>
            <input name="api_input" id="api_input" type="text" value={user_settings.APIKey}></input>
            </div>
            : null}
        </div>
    );
}
