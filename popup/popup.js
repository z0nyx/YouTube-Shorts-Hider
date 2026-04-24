const DEFAULT_SETTINGS = {
  enabled: true,
  closeOnShorts: true
};

const enabledInput = document.getElementById('enabled');
const closeOnShortsInput = document.getElementById('closeOnShorts');

function syncDependents() {
  closeOnShortsInput.disabled = !enabledInput.checked;
}

chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
  enabledInput.checked = Boolean(settings.enabled);
  closeOnShortsInput.checked = Boolean(settings.closeOnShorts);
  syncDependents();
});

enabledInput.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: enabledInput.checked });
  syncDependents();
});

closeOnShortsInput.addEventListener('change', () => {
  chrome.storage.local.set({ closeOnShorts: closeOnShortsInput.checked });
});
