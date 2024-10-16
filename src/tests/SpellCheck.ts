export default function SpellCheck() {
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        function(tabs){
           alert(tabs[0].url);
        }
     );     


    return false;
}