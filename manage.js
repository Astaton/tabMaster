document.addEventListener('DOMContentLoaded', () => {

    const viewTabs = (groupName) => {
        console.log(`group "%s" was clicked`, groupName);
        chrome.storage.sync.get(groupName, (storage) => {
            console.log('retrieved from storage: ', storage[groupName]);
            //<li class="groupTabListItem"></li>
        });
    }

    const openTabs = (groupName) => {
        console.log('clicked to open tabs for "%s" group', groupName);
        chrome.storage.sync.get(groupName, (storage) => {
            console.log('retrieved from storage: ', storage[groupName]);
            const tabUrls = storage[groupName].map(tab => tab.url);
            chrome.windows.create({url: tabUrls}, (window) => {
                console.log('window created', window);
            })
        });
    }

    const deleteTabGroup = (groupName) => {
        console.log("clicked to delete tab group", groupName);
        chrome.storage.sync.remove(groupName, () => {
            chrome.storage.sync.get('tabMasterGroupNames', (storage) => {
                console.log('tabMasterGroupNames from storage: ', storage);
                const updatedGroupNames = Object.assign({}, storage.tabMasterGroupNames);
                delete updatedGroupNames[groupName];
                console.log("group names after deleting key: ", updatedGroupNames);
                chrome.storage.sync.set({'tabMasterGroupNames': updatedGroupNames}, () => {
                    console.log('deletion complete');
                    chrome.tabs.getCurrent((tab) => {
                        console.log("The current tab is: ", tab);
                        chrome.tabs.reload(tab.id);
                    });
                })
            })
        });
    }    

    chrome.storage.sync.get('tabMasterGroupNames', (storage) => {
        const tabGroups = Object.keys(storage.tabMasterGroupNames);
        const groupListElem = document.getElementById("groupsList");        
        tabGroups.forEach(groupName => {
            const groupElem = document.createElement('li');
            groupElem.classList.add('groupListItem');
            groupElem.innerHTML = `
                <div class="optionsContainer">
                    <h2>${groupName}</h2>
                    <p class="optionsText" id="open${groupName}">Open this group</p>
                    <p class="optionsText" id="view${groupName}">View tabs in this group</p>
                    <p class="optionsText" id="delete${groupName}">Delete this group</p>
                </div>
                <ul class="groupTabList" id="${groupName}TabList">
                </ul>
            `;
            groupListElem.appendChild(groupElem);
            const openGroupElem = document.getElementById(`open${groupName}`);
            const viewGroupElem = document.getElementById(`view${groupName}`);
            const deleteGroupElem = document.getElementById(`delete${groupName}`);
            
            openGroupElem.addEventListener("click", () => openTabs(groupName));
            viewGroupElem.addEventListener("click", () => viewTabs(groupName));
            deleteGroupElem.addEventListener("click", () => deleteTabGroup(groupName));
        });
    });
});