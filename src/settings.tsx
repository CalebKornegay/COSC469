import React, {useRef} from 'react';

export type UserSettings = {
    APIKey: string | undefined,
    runtype: string | undefined,
};

export const SettingsContext = React.createContext<UserSettings>({APIKey: undefined, runtype: undefined});

export default function Settings() {
    const user_settings = React.useContext(SettingsContext);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(
        localStorage.getItem('api_key') || ''
    );
    
    React.useEffect(() => {
        localStorage.setItem('api_key', inputValue);
    }, [inputValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="SettingsDropdown">
            <button onClick={() => setSettingsOpen(!settingsOpen)}>Settings</button>
            {settingsOpen ? 
            <div className='APIInput'>
            <label>Enter your ChatGPT API Key: </label>
            <input name="api_input" id="api_input" type="text" value={inputValue} onChange={handleChange}></input>
            </div>
            : null}
        </div>
    );
}
