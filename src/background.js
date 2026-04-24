const DEFAULT_SETTINGS = {
  enabled: true,
  closeOnShorts: true
};

function isShortsUrl(url) {
  if (!url) return false;
  return /(?:^|\.)youtube\.com\/shorts\//i.test(url) || /youtu\.be\/shorts\//i.test(url);
}

function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
      resolve(settings || DEFAULT_SETTINGS);
    });
  });
}

function closeTabIfAllowed(tabId, url) {
  getSettings().then((settings) => {
    if (!settings.enabled || !settings.closeOnShorts || !isShortsUrl(url)) {
      return;
    }

    chrome.tabs.remove(tabId, () => {
      if (chrome.runtime.lastError) {
        console.log('ShortsHider: failed to close tab:', chrome.runtime.lastError.message);
      }
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
    chrome.storage.local.set({
      enabled: settings.enabled,
      closeOnShorts: settings.closeOnShorts
    });
  });
});

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url) {
    closeTabIfAllowed(tab.id, tab.url);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    closeTabIfAllowed(tabId, changeInfo.url);
    return;
  }

  if (tab && tab.url) {
    closeTabIfAllowed(tabId, tab.url);
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'closeTab' && sender.tab) {
    closeTabIfAllowed(sender.tab.id, sender.tab.url || '');
  }
});
