import React, {useEffect, useState} from 'react';

type childprops = {
    settingsOpen: boolean,
    setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Settings({settingsOpen, setSettingsOpen}: childprops) {
    const [apiKeyValue, setApiKeyValue] = useState(
        localStorage.getItem('api_key') || ''
    );
    const [costlyTests, setCostlyTests] = useState<boolean>(
        localStorage.getItem('costly_tests') === '1'
    );
    
    useEffect(() => {
        localStorage.setItem('api_key', apiKeyValue);
    }, [apiKeyValue]);

    useEffect(() => {
        localStorage.setItem('costly_tests', costlyTests ? '1' : '0');
    }, [costlyTests]);

    const handleApiKeyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKeyValue(event.target.value);
    };

    const handleCostlyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCostlyTests(event.target.checked);
    };

    const handleSavedTestsReset = () => {
        localStorage.removeItem('testHistory');
        alert('Saved tests cleared');
    };

    const handleSavedTestDownload = () => {
        const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
        const blob = new Blob([JSON.stringify(testHistory)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'testHistory.json';
        a.click();
    }

    return (
        <div className={settingsOpen ? "SettingsDropdownOpen" : ""}>
            <button className="SettingsButton" onClick={() => setSettingsOpen(!settingsOpen)}>Settings</button>
            {settingsOpen ? 
            <>
                <div className='APIInput'>
                <label>OpenAI API Key: </label>
                <input name="api_input" id="api_input" type="text" value={apiKeyValue} onChange={handleApiKeyInputChange}></input>
                </div>
                <div className='APIInput'>
                <label>Enable Costly Tests: </label>
                <input name='costly_input' id='costly_input' type='checkbox' checked={costlyTests} onChange={handleCostlyInputChange}></input>
                </div>
                <button className='RunTestsButton' onClick={handleSavedTestsReset}>Clear Saved Tests</button>
                <button className='RunTestsButton' onClick={handleSavedTestDownload}>Download Tests</button>
            </>
            : null}
        </div>
    );
}
