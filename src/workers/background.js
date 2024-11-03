/* eslint-disable no-undef */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getFooter") {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (tab?.id) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        func: () => {
                            const footer = document.querySelector("footer");
                            return footer ? footer.outerHTML : null;
                        },
                    },
                    (results) => {
                        const footerContent = results[0]?.result || null;
                        sendResponse({ footerContent });
                    }
                );
            } else {
                sendResponse({ footerContent: null });
            }
        });
        return true; // Keeps the message channel open for sendResponse
    }
});
