document.addEventListener("DOMContentLoaded", () => {

  const viewTabs = (groupName) => {
    const groupTabsListElem =  document.getElementById(`${groupName}TabList`);
    const menuTextSpan = document.getElementById(`${groupName}SpanText`);
    const currentPosition = parseInt(groupTabsListElem.style.marginTop);
    const listHeight = groupTabsListElem.offsetHeight;

    if (currentPosition < 0) {
      slideTabsOut(listHeight, groupTabsListElem);
      menuTextSpan.innerText = "Hide";
    } else {
      slideTabsIn(listHeight, groupTabsListElem);
      menuTextSpan.innerText = "View";
    }
  };

  const slideTabsOut = (margin, groupTabsListElem) => {
    let currentMargin = -margin;
    let groupTabElems = groupTabsListElem.children;
    let currentTabIndex = groupTabElems.length - 1;
    groupTabElems[currentTabIndex].classList.remove('hidden');
    let marginTimer = setInterval(() => {
      currentMargin += 4;
      groupTabsListElem.style.marginTop = `${currentMargin}px`;
      if (currentMargin >= 8) {
        clearInterval(marginTimer);
      }
    },15);
    let styleTimer= setInterval(() => {
        if (currentTabIndex <= 0) {
          clearInterval(styleTimer);
        } else {
          currentTabIndex -= 1;
          console.log('In style timer ', currentTabIndex);
          groupTabElems[currentTabIndex].classList.remove('hidden');
        }
    }, 225);
  }

  const slideTabsIn = (margin, groupTabsListElem) => {
    let currentMargin = 8;
    let groupTabElems = groupTabsListElem.children;
    let currentTabIndex = 0;
    groupTabElems[currentTabIndex].classList.add('hidden');
    let marginTimer = setInterval(() => {
      currentMargin -= 4;
      groupTabsListElem.style.marginTop = `${currentMargin}px`;
      if (currentMargin <= -margin) {
        groupTabsListElem.style.marginTop = `${-margin}px`;
        clearInterval(marginTimer);
      }
    },15);
    let styleTimer= setInterval(() => {
      if (currentTabIndex >= groupTabElems.length - 1) {
        clearInterval(styleTimer);
      } else {
        currentTabIndex += 1;
        groupTabElems[currentTabIndex].classList.add('hidden');
      }
  }, 225);
  }

  const openTabs = (groupName) => {
    chrome.storage.sync.get(groupName, (storage) => {
      const tabUrls = storage[groupName].map((tab) => tab.url);
      chrome.windows.create({ url: tabUrls }, (window) => {
        chrome.tabs.getCurrent(({id: currentTab}) => {
          console.log(currentTab);
          chrome.tabs.remove(currentTab);
        });
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

  const deleteTabGroup = () => {
    const groupNameSpan = document.getElementById("groupName");
    const groupName = groupNameSpan.innerText;
    chrome.storage.sync.remove(groupName, () => {
      chrome.storage.sync.get("tabMasterGroupNames", (storage) => {
        const updatedGroupNames = Object.assign(
          {},
          storage.tabMasterGroupNames
        );
        delete updatedGroupNames[groupName];
        chrome.storage.sync.set(
          { tabMasterGroupNames: updatedGroupNames },
          () => {
            const notifOptions = {
              type: "basic",
              iconUrl: "icon48.png",
              title: "Deleted!",
              message: `Tab group '${groupName}' has been deleted`,
            };
            chrome.notifications.create("deleteNotif", notifOptions);
            chrome.tabs.getCurrent((tab) => {
              chrome.contextMenus.remove(groupName, () => {
                chrome.tabs.reload(tab.id);
              });
            });
          }
        );
      });
    });
  };

  chrome.storage.sync.get("tabMasterGroupNames", (storage) => {
    const tabGroups = Object.keys(storage.tabMasterGroupNames);
    const groupListElem = document.getElementById("groupsList");
    tabGroups.forEach((groupName) => {
      createGroupListElem(groupListElem, groupName);
      createGroupTabListElems(groupName);
    });
  });

  const createGroupListElem = (groupListElem, groupName) => {
    const groupElem = document.createElement("li");
      groupElem.classList.add("groupListItem");
      groupElem.innerHTML = `
                <div class="groupWrapper">
                    <div class="groupContainer">
                        <h2 class="groupNameText">${groupName}</h2>
                        <div class="optionsContainer">
                            <p class="optionsText" id="open${groupName}">Open this group</p>
                            <p class="optionsText" id="view${groupName}">
                            <span id=${groupName}SpanText>View</span> tabs in this group
                            </p>
                            <p class="optionsText" id="delete${groupName}">Delete this group</p>
                        </div>
                    </div>
                    <div id="${groupName}TabListContainer">
                        
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
  }

  const createGroupTabListElems = (groupName) => {
    const groupTabsListElem = document.createElement('ul');
    const tabListContainerElem = document.getElementById(`${groupName}TabListContainer`);
    groupTabsListElem.id = `${groupName}TabList`;
    groupTabsListElem.classList.add("groupTabList");
    chrome.storage.sync.get(groupName, (storage) => {
        storage[groupName].forEach(({favIconUrl, title, url}, tabNo) => {
            const groupTabElem = document.createElement('li');
            groupTabElem.classList.add('tabInfo');
            groupTabElem.classList.add('hidden');
            groupTabElem.id = `${groupName}TabNo${tabNo}`;
            groupTabElem.innerHTML = `
                <img class='faviconImg' src=${favIconUrl ? favIconUrl : 'default.png'} />
                <div class='urlInfo' > 
                    <p class='tabInfoText'>Tab Title: ${title}</p> 
                    <p class='tabInfoText'>Tab Url: ${url}</p>
                </div>
                `
            groupTabsListElem.appendChild(groupTabElem);
        });

        tabListContainerElem.appendChild(groupTabsListElem);
        const listHeight = groupTabsListElem.offsetHeight;
        groupTabsListElem.style.marginTop = `-${listHeight}px`;
    });
  }

});
