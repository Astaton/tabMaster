// window.pages = {};

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (!window.pages[request.url]) {
//         window.pages[request.url] = true;
//     }
// });

// chrome.browserAction.onClicked.addListener((tab) => {
//     chrome.tabs.create({url: 'popup.html'})
// })

const contextMenuItem = {
    "id": "addTab",
    "title": "Add tab to a tab group",
    "contexts": ["page"]
}

const testContextMenu = {
    "id": "test1",
    "parentId": "addTab",
    "title": "test1",
    "contexts": ["page"] 
}

chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClicked.addListener;

chrome.contextMenus.create(testContextMenu);

