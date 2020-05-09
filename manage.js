document.addEventListener("DOMContentLoaded", () => {
  const viewTabs = (groupName) => {
    const groupTabsListElem = document.createElement('ul');
    groupTabsListElem.id = `${groupName}TabList`;
    groupTabsListElem.classList.add("groupTabList");
    console.log(`group "%s" was clicked`, groupName);
    chrome.storage.sync.get(groupName, (storage) => {
        console.log("retrieved from storage: ", storage[groupName]);
        storage[groupName].forEach(({favIconUrl, title, url}) => {
            const groupTabElem = document.createElement('li');
            groupTabElem.innerHTML = `
                <img class='faviconImg' src=${favIconUrl ? favIconUrl : 'default.png'} />
                <div class='urlInfo' > 
                    <p class='tabInfoText'>Tab Title: ${title}</p> 
                    <p class='tabInfoText'>Tab Url: ${url}</p>
                </div>
                `
            groupTabsListElem.appendChild(groupTabElem);
        });
      //<li class="groupTabListItem"></li>
    });
  };

  const openTabs = (groupName) => {
    console.log('clicked to open tabs for "%s" group', groupName);
    chrome.storage.sync.get(groupName, (storage) => {
      console.log("retrieved from storage: ", storage[groupName]);
      const tabUrls = storage[groupName].map((tab) => tab.url);
      chrome.windows.create({ url: tabUrls }, (window) => {
        console.log("window created", window);
      });
    });
  };

  const confrimDeleteGroup = (groupName) => {
    const groupNameSpan = document.getElementById("groupName");
    const confirmDeleteModalElem = document.getElementById(
      "confirmDeleteModal"
    );
    groupNameSpan.innerText = `${groupName}`;
    confirmDeleteModalElem.classList.add("showModal");
  };

  const cancelDelete = () => {
    const confirmDeleteModalElem = document.getElementById(
      "confirmDeleteModal"
    );
    confirmDeleteModalElem.classList.remove("showModal");
  };

  const deleteTabGroup = (groupName) => {
    const groupNameSpan = document.getElementById("groupName");

    console.log("clicked to delete tab group", groupNameSpan.innerText);
    // chrome.storage.sync.remove(groupName, () => {
    //   chrome.storage.sync.get("tabMasterGroupNames", (storage) => {
    //     console.log("tabMasterGroupNames from storage: ", storage);
    //     const updatedGroupNames = Object.assign(
    //       {},
    //       storage.tabMasterGroupNames
    //     );
    //     delete updatedGroupNames[groupName];
    //     console.log("group names after deleting key: ", updatedGroupNames);
    //     chrome.storage.sync.set(
    //       { tabMasterGroupNames: updatedGroupNames },
    //       () => {
    //         const notifOptions = {
    //           type: "basic",
    //           iconUrl: "icon48.png",
    //           title: "Deleted!",
    //           message: `Tab group '${groupName} has been deleted'`,
    //         };
    //         chrome.notifications.create("deleteNotif", notifOptions);
    //         console.log("deletion complete");
    //         chrome.tabs.getCurrent((tab) => {
    //           console.log("The current tab is: ", tab);
    //           chrome.tabs.reload(tab.id);
    //         });
    //       }
    //     );
    //   });
    // });
  };

  chrome.storage.sync.get("tabMasterGroupNames", (storage) => {
    const tabGroups = Object.keys(storage.tabMasterGroupNames);
    const groupListElem = document.getElementById("groupsList");
    tabGroups.forEach((groupName) => {
      const groupElem = document.createElement("li");
      groupElem.classList.add("groupListItem");
      groupElem.innerHTML = `
                <div class="groupWrapper">
                    <div class="groupContainer">
                        <h2 class="groupNameText">${groupName}</h2>
                        <div class="optionsContainer">
                            <p class="optionsText" id="open${groupName}">Open this group</p>
                            <p class="optionsText" id="view${groupName}">View tabs in this group</p>
                            <p class="optionsText" id="delete${groupName}">Delete this group</p>
                        <div/>
                    </div>
                    <div id="${groupName}TabListContainer">
                        <ul class="groupTabList" id="${groupName}TabList">
                        </ul>
                    </div>
                </div>
            `;
      groupListElem.appendChild(groupElem);
      const openGroupElem = document.getElementById(`open${groupName}`);
      const viewGroupElem = document.getElementById(`view${groupName}`);
      const deleteGroupElem = document.getElementById(`delete${groupName}`);
      const confirmDeleteBtn = document.getElementById("confirmDelete");
      const cancelDeleteBtn = document.getElementById("cancelDelete");

      openGroupElem.addEventListener("click", () => openTabs(groupName));
      viewGroupElem.addEventListener("click", () => viewTabs(groupName));
      deleteGroupElem.addEventListener("click", () =>
        confrimDeleteGroup(groupName)
      );
      confirmDeleteBtn.addEventListener("click", () => deleteTabGroup());
      cancelDeleteBtn.addEventListener("click", () => cancelDelete());
    });
  });
});
