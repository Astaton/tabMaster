//popup.js is the script that runs in the extension popup html.
document.addEventListener('DOMContentLoaded', () => {
    console.log('saveGroup loading')
    
    let newGroup;
    chrome.windows.getCurrent((currentWindow) => {
        chrome.tabs.query( {windowId: currentWindow.id}, (tabs) => {
            newGroup = [];
            tabs.forEach(({favIconUrl, title, url}, index) => {
                if(title !== "TabMaster Save Group" && title !== "TabMaster Manage Groups" && title !== "Extensions"){
                    const tabListElem = document.getElementById('tabList');
                    const tabElem = document.createElement('li');
                    tabElem.classList.add('tabInfo');
                    tabElem.id = `tab${index}`;
                    tabElem.innerHTML = `
                        <img class='faviconImg' src=${favIconUrl ? favIconUrl : 'default.png'} />
                        <div class='urlInfo' > 
                            <p class='tabInfoText'>Tab Title: ${title}</p> 
                            <p class='tabInfoText'>Tab Url: ${url}</p>
                        </div>
                    `
                    tabListElem.appendChild(tabElem);
                    document.getElementById(`tab${index}`).addEventListener('click', () => tabClick(index), false);
                    newGroup.push({favIconUrl, title, url, inGroup: true});
                }
            });
            const tabCountElem = document.getElementById('tabCount');
            const tabsSelectedCountElem = document.getElementById('tabsSelectedCount');
            tabsSelectedCountElem.innerHTML = `There are currently ${newGroup.length} tabs in this group.`
            tabCountElem.innerHTML = `<span id="tabCount">${newGroup.length}</span>`
        });

        const tabClick = (index) => {
            newGroup[index].inGroup = !newGroup[index].inGroup;
            const tabElem = document.getElementById(`tab${index}`);
            const tabsSelectedCountElem = document.getElementById('tabsSelectedCount');
            tabsSelectedCountElem.innerHTML = `There are currently ${newGroup.reduce((acc, curr) => { return curr.inGroup? ++acc : acc},0)} tabs in this group.`

            if (newGroup[index].inGroup) {
                tabElem.classList.remove('tabUnselected');
            } else {
                tabElem.classList.add('tabUnselected');
            }

            console.log(`tab ${newGroup[index].title} will ${newGroup[index].inGroup? "be" : "not be"} saved to the group`);
        }
        
    });


    const saveGroup = (groupName, tabGroups) => {
        tabGroups[groupName] = true;
        chrome.storage.sync.set({
            'tabMasterGroupNames': tabGroups,
            [groupName]: newGroup,
        }, () => {
            const subContextMenuItem = {
                "id": groupName,
                "parentId": "addTab",
                "title": `Add to ${groupName}`,
                "contexts": ["page"] 
            }
            chrome.contextMenus.create(subContextMenuItem);
            const notifOptions = {
                type: 'basic',
                iconUrl: 'icon48.png',
                title: 'Success!',
                message: `Tab group '${groupName}' has been saved`
            }
            chrome.notifications.create('savedNotif', notifOptions, () => {
                chrome.tabs.getCurrent(({id: currentTabId}) => {
                    chrome.tabs.remove(currentTabId);
                });
            });
        });
    }


    const enter = ({keyCode}) => {
        console.log('key pressed on input', keyCode)
        if (keyCode === 13) {
            checkCanSaveGroup();
        }
    }


    const clicked = () => {
        checkCanSaveGroup();
    }

    const closeModal = () => {
        const confirmOverwriteModalElem = document.getElementById('confirmOverwriteModal');
        confirmOverwriteModalElem.classList.remove('showModal');
    }


    const checkCanSaveGroup = (overwrite = false) => {
        const groupName = document.getElementById("groupNameInput").value;
        if(!groupName){
            alert("This group needs to have a name.");
            return;
        }
        newGroup =   newGroup.filter(tab => tab.inGroup === true);
        console.log("The filtered newGroup is: ", newGroup);

        chrome.storage.sync.get('tabMasterGroupNames', (storage) => {
            let tabGroups = storage.tabMasterGroupNames;
            if(tabGroups === undefined) tabGroups = {};
            console.log("tabMasterGroupNames: ", tabGroups);
    
            if(tabGroups[groupName] && !overwrite){
                const groupNameSpanElem = document.getElementById('groupNameSpan');
                groupNameSpanElem.innerText = groupName;
                const confirmOverwriteModalElem = document.getElementById('confirmOverwriteModal');
                confirmOverwriteModalElem.classList.add('showModal');
            } else {
                saveGroup(groupName, tabGroups);
            }
        });
    }


    document.getElementById('groupNameInput').addEventListener('keyup', enter, false);
    document.getElementById('saveGroupBtn').addEventListener('click', clicked, false);
    document.getElementById('cancelBtn').addEventListener('click', closeModal, false);
    document.getElementById('confirmBtn').addEventListener('click', () => checkCanSaveGroup(true), false);

}, false);
