import React from 'react';
import { SettingsContext } from '../settings';

export default function URLCheck() {
    const api_key = React.useContext(SettingsContext).APIKey;
    console.log(api_key);
    return false;
}