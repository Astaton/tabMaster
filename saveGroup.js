//popup.js is the script that runs in the extension popup html.
document.addEventListener('DOMContentLoaded', () => {
    
    let newGroup;
    chrome.windows.getCurrent((currentWindow) => {
        chrome.tabs.query( {windowId: currentWindow.id}, (tabs) => {
            newGroup = [];
            tabs.forEach(({favIconUrl, title, url}, index) => {
                if(title !== "TabMaster Save Group" && title !== "TabMaster Manage Groups" && title !== "Extensions"){
                    $('#tabList').append(`<li class='tabInfo' id=tab${index}><img class='faviconImg' src=${favIconUrl ? favIconUrl : 'default.png'} /><div class='urlInfo' > <p class='tabInfoText'>Tab Title: ${title}</p> <p class='tabInfoText'>Tab Url: ${url}</p></div><li>`);
                    document.getElementById(`tab${index}`).addEventListener('click', () => tabClick(index), false);
                    newGroup.push({favIconUrl, title, url, inGroup: true});
                }
            });
            $('#tabCount').replaceWith(`<span id="tabCount">${newGroup.length}</span>`);
        });

        const tabClick = (index) => {
            newGroup[index].inGroup = !newGroup[index].inGroup;
            console.log(`tab ${newGroup[index].title} will ${newGroup[index].inGroup? "be" : "not be"} saved to the group`);
        }
        
    });

    
    const clicked = () => {
        const groupName = document.getElementById("groupName").value;
        console.log('groupName is: ', groupName);
        newGroup =   newGroup.filter(tab => tab.inGroup === true);
        console.log("The filtered newGroup is: ", newGroup);

        chrome.storage.sync.get('tabMasterGroupNames', (storage) => {
            let tabGroups = storage.tabMasterGroupNames;
            if(tabGroups === undefined) tabGroups = {};
            console.log("tabMasterGroupNames: ", tabGroups);
    
            if(!groupName){
                alert("This group needs to have a name.");
                return;
            }
            if(tabGroups[groupName]){
                alert("This group exists, setup func to overwrite");
            } else {
                tabGroups[groupName] = true;
                chrome.storage.sync.set({
                    'tabMasterGroupNames': tabGroups,
                    [groupName]: newGroup,
                });
            }
        });
    

    }

    document.getElementById('saveGroupBtn').addEventListener('click', clicked, false);

}, false);
