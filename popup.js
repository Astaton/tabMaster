//popup.js is the script that runs in the extension popup html.
document.addEventListener('DOMContentLoaded', () => {

    (function(){
        chrome.windows.getCurrent(({id: currentWindow}) => {
            chrome.storage.local.get(['tabGroupWindows'], (storage) => {
                const tabGroupWindows = storage.tabGroupWindows || {};
                if (tabGroupWindows[currentWindow]) {
                    const groupNameSpan1Elem = document.getElementById('popupMenuGroupNameSpan1');
                    const groupNameSpan2Elem = document.getElementById('popupMenuGroupNameSpan2');
                    const menuHeaderContainerElem = document.getElementById('popupMenuHeaderContainer');
                    groupNameSpan1Elem.innerText = tabGroupWindows[currentWindow];
                    groupNameSpan2Elem.innerText = tabGroupWindows[currentWindow];
                    menuHeaderContainerElem.classList.remove('hidden');
                }
            });
        });
    })();

    const updateTabGroup = () => {
        chrome.windows.getCurrent(({id: currentWindow}) => {
            chrome.tabs.query({windowId: currentWindow}, (tabs) => {
                const tabGroup = [];
                tabs.forEach(({favIconUrl, title, url}) => tabGroup.push({favIconUrl, title, url}));
                chrome.storage.local.get(['tabGroupWindows'], (storage) => {
                    const groupName = storage.tabGroupWindows[currentWindow];
                    chrome.storage.sync.set({[groupName]: tabGroup}, () => {
                        const notifOptions = {
                            type: "basic",
                            iconUrl: "icon48.png",
                            title: "Updated!",
                            message: `Tab group '${groupName}' has been updated.`
                        }
                        chrome.notifications.create('updateNotif', notifOptions);
                        chrome.tabs.getCurrent((tab) => {
                            chrome.tabs.remove(tab.id);
                        })
                    })
                });
            });
        });
    }

    const openTab = (tab) => {
        chrome.tabs.create({url: tab});
    }
    
    document.getElementById('updateGroupBtn').addEventListener('click', () => updateTabGroup(), false);
    document.getElementById('createGroupBtn').addEventListener('click', () => openTab('saveGroup.html'), false);
    document.getElementById('manageGroupsBtn').addEventListener('click', () => openTab('manage.html'), false);

}, false);
