//popup.js is the script that runs in the extension popup html.
document.addEventListener('DOMContentLoaded', () => {

    const openTab = (tab) => {
        chrome.tabs.create({url: tab});
    }
    
    document.getElementById('createGroupBtn').addEventListener('click', () => openTab('saveGroup.html'), false);
    document.getElementById('manageGroupsBtn').addEventListener('click', () => openTab('manage.html'), false);

}, false);
