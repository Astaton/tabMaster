//runs in the background on all pages
//variable needs to be assigned to the window so that it will
//accessable in the popup.js
window.pages = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!window.pages[request.url]) {
        window.pages[request.url] = true;
    }
});

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.create({url: 'popup.html'})
})