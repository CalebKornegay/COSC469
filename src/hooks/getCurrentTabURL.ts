export default function getCurrentTabURL(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      function (tabs) {
        if (tabs.length > 0) {
          resolve(tabs[0].url || "");
        } else {
          reject("No active tab found");
        }
      }
    );
  });
}
