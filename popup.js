document.addEventListener('DOMContentLoaded', function() {
// Stealth Mode: Purge last 10 mins of history
document.getElementById('incognitoBtn').onclick = () => {
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    chrome.history.deleteRange({startTime: tenMinutesAgo, endTime: Date.now()}, () => {
        // Visual feedback in the popup
        const originalText = document.getElementById('incognitoBtn').innerText;
        document.getElementById('incognitoBtn').innerText = "PROTOCOL_EXECUTED";
        setTimeout(() => { document.getElementById('incognitoBtn').innerText = originalText; }, 2000);
    });
};

    const picker = document.getElementById('colorPicker');
    const saveBtn = document.getElementById('saveBtn');
    const panicBtn = document.getElementById('panicBtn');

    chrome.storage.local.get(['uiColor'], (data) => {
        if (data.uiColor) document.documentElement.style.setProperty('--theme', data.uiColor);
    });

    picker.oninput = () => {
        const color = `hsl(${picker.value}, 100%, 50%)`;
        document.documentElement.style.setProperty('--theme', color);
    };

    saveBtn.onclick = () => {
        const color = `hsl(${picker.value}, 100%, 50%)`;
        chrome.storage.local.set({ uiColor: color });
    };

    panicBtn.onclick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => { 
                        window.WAYNE_PANIC = true;
                        if (window.coreLoop) clearInterval(window.coreLoop);
                        const style = document.getElementById('wayne-core-v2-style');
                        const hud = document.getElementById('wayne-player-hud');
                        const brand = document.getElementById('wayne-core-brand');
                        if (style) style.remove();
                        if (hud) hud.remove();
                        if (brand) brand.remove();
                        document.body.classList.remove('thermal-active');
                        document.body.style.animation = "none";
                        document.body.style.background = "";
                    }
                });
            }
        });
    };
});
