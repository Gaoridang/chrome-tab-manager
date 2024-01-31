chrome.tabs.onCreated.addListener((tab) => {
  const tabInfo = {
    id: tab.id,
    title: tab.title,
    url: tab.url,
    createdAt: Date.now(),
  };

  chrome.storage.local.set({ [tab.id as number]: tabInfo });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.title || changeInfo.url) {
    const tabInfo = {
      id: tabId,
      title: tab.title,
      url: tab.url,
      createdAt: Date.now(),
    };

    chrome.storage.local.set({ [tabId]: tabInfo });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(tabId.toString());
});
