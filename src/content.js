(function () {
  'use strict';

  const DEFAULT_SETTINGS = {
    enabled: true,
    closeOnShorts: true
  };

  let settings = { ...DEFAULT_SETTINGS };
  const ROOT = document.documentElement;
  const ENABLED_ATTR = 'data-shorts-hider-enabled';

  function isShortsUrl(url) {
    return Boolean(url && /(?:^|\.)youtube\.com\/shorts\//i.test(url));
  }

  function closeCurrentTab() {
    chrome.runtime.sendMessage({ action: 'closeTab' });
  }

  function applyEnabledState() {
    if (settings.enabled) {
      ROOT.setAttribute(ENABLED_ATTR, 'true');
    } else {
      ROOT.removeAttribute(ENABLED_ATTR);
    }
  }

  function evaluateCurrentPage() {
    applyEnabledState();

    if (!settings.enabled) {
      return;
    }

    if (settings.closeOnShorts && window.location.pathname.startsWith('/shorts/')) {
      closeCurrentTab();
    }
  }

  function loadSettingsAndApply() {
    chrome.storage.local.get(DEFAULT_SETTINGS, (stored) => {
      settings = { ...DEFAULT_SETTINGS, ...stored };
      evaluateCurrentPage();
    });
  }

  document.addEventListener(
    'click',
    (event) => {
      if (!settings.enabled || !settings.closeOnShorts) return;

      const link = event.target.closest('a[href]');
      if (!link || !isShortsUrl(link.href)) return;

      event.preventDefault();
      event.stopPropagation();
      closeCurrentTab();
    },
    true
  );

  const originalPushState = history.pushState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    setTimeout(evaluateCurrentPage, 100);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    setTimeout(evaluateCurrentPage, 100);
  };

  window.addEventListener('popstate', () => {
    setTimeout(evaluateCurrentPage, 100);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;

    if (changes.enabled) {
      settings.enabled = Boolean(changes.enabled.newValue);
    }

    if (changes.closeOnShorts) {
      settings.closeOnShorts = Boolean(changes.closeOnShorts.newValue);
    }

    evaluateCurrentPage();
  });

  loadSettingsAndApply();
})();
