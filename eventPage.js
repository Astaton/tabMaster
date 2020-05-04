
// document.addEventListener('DOMContentLoaded', () => {
    
// });
console.log('clicked');
        

const contextMenuItem = {
    "id": "addTab",
    "title": "Add tab to an existing group",
    "contexts": ["page"]
}



chrome.contextMenus.create(contextMenuItem, () => {
    
    chrome.storage.sync.get('tabMasterGroupNames', (storage) => {
        const tabGroups = storage.tabMasterGroupNames;
        
        if (tabGroups) {
            const tabGroupsArray = Object.keys(tabGroups);
            
            tabGroupsArray.forEach(groupName => {
                const subContextMenuItem = {
                    "id": groupName,
                    "parentId": "addTab",
                    "title": `Add to ${groupName}`,
                    "contexts": ["page"] 
                }
                chrome.contextMenus.create(subContextMenuItem);
    
            })
        } else {
            const subContextMenuItem = {
                "id": "noGroups",
                "parentId": "addTab",
                "title": "No Existing Groups",
                "contexts": ["page"]
            }
            chrome.contextMenus.create(subContextMenuItem);
        }
    });
});

chrome.contextMenus.onClicked.addListener(({menuItemId}, {favIconUrl, title, url}) => {
    if(menuItemId === 'noGroups'){
        const notifOptions = {
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'No Tab Groups!',
            message: `You don't have any tab groups saved! ${menuItemId}`
        }
        chrome.notifications.create('contextClickNotif', notifOptions);
    } else {
        //create object for the new tab
        const currentTabObject = {
            url,
            title,
            favIconUrl
        };
        //add new tab object to the group array
        chrome.storage.sync.get(menuItemId, (storage) => {
            const tabGroup = storage[menuItemId];
            tabGroup.push(currentTabObject);
            //save the updated group to storage
            chrome.storage.sync.set({[menuItemId]: tabGroup}, () => {
                const notifOptions = {
                    type: 'basic',
                    iconUrl: 'icon48.png',
                    title: 'Tab Saved!',
                    message: `This tab is now part of group '${menuItemId}'.`
                }
                chrome.notifications.create('contextClickNotif', notifOptions);
            });
        });
    } 
});



