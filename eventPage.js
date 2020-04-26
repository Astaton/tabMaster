window.pages = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!window.pages[request.url]) {
        window.pages[request.url] = true;
    }
});

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.create({url: 'popup.html'})
})