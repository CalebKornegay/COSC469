import React, {useRef} from 'react';

type childprops = {
    settingsOpen: boolean,
    setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Settings({settingsOpen, setSettingsOpen}: childprops) {
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
        <div className={settingsOpen ? "SettingsDropdownOpen" : "SettingsDropdownClosed"}>
            <button className="SettingsButton" onClick={() => setSettingsOpen(!settingsOpen)}>Settings</button>
            {settingsOpen ? 
            <>
                <div className='APIInput'>
                <label>ChatGPT API Key: </label>
                <input name="api_input" id="api_input" type="text" value={inputValue} onChange={handleChange}></input>
                </div>
            </>
            : null}
        </div>
    );
}
