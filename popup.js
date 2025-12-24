document.addEventListener('DOMContentLoaded', () => {
  let selectedColor = "#00ccff";

  chrome.storage.local.get(['brandEnabled', 'focusEnabled', 'audioEnabled', 'uiColor'], (res) => {
    document.getElementById('brandToggle').checked = res.brandEnabled !== false;
    document.getElementById('focusToggle').checked = res.focusEnabled !== false;
    document.getElementById('audioToggle').checked = res.audioEnabled !== false;
    selectedColor = res.uiColor || "#00ccff";
    document.body.style.setProperty('--hacker-col', selectedColor);
  });

  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      selectedColor = e.target.dataset.color;
      document.body.style.setProperty('--hacker-col', selectedColor);
    });
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    chrome.storage.local.set({
      brandEnabled: document.getElementById('brandToggle').checked,
      focusEnabled: document.getElementById('focusToggle').checked,
      audioEnabled: document.getElementById('audioToggle').checked,
      uiColor: selectedColor
    }, () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
        window.close();
      });
    });
  });
});