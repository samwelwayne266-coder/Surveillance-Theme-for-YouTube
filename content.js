/**
 * PROJECT: Surveillance-Interface-for-YouTube
 * OPERATOR: Wayne Core
 * STATUS: VERSION_2.1_DEPLOYED
 * VERSION: 2.1 // LOGO_PURGED // BRAND_CENTERED
 */

let audioCtx;
let buffer = "";
const secret = "WAYNE";

function synth(f, t, d, v = 0.04) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = t; o.frequency.value = f;
        g.gain.setValueAtTime(v, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + d);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(); o.stop(audioCtx.currentTime + d);
    } catch(e) {}
}

function applyV21() {
    if (window.WAYNE_PANIC === true) {
        if (window.coreLoop) clearInterval(window.coreLoop);
        return;
    }

    if (!chrome.runtime?.id) {
        if (window.coreLoop) clearInterval(window.coreLoop);
        const hud = document.getElementById('wayne-player-hud');
        if (hud) hud.remove();
        return; 
    }

    chrome.storage.local.get(['uiColor'], (data) => {
        if (chrome.runtime.lastError) return;
        const theme = data.uiColor || "#00ccff";

        let style = document.getElementById('wayne-core-v2-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'wayne-core-v2-style';
            document.head.appendChild(style);
        }

        style.innerHTML = `
/* 1. Kill the sidebar containers entirely */
#guide, 
ytd-guide-renderer, 
#mini-guide, 
ytd-mini-guide-renderer, 
#guide-wrapper { 
    display: none !important; 
    width: 0 !important;
}

/* 2. Remove the left margin/padding that usually makes room for the sidebar */
ytd-app[guide-persistent-and-visible] #page-manager.ytd-app,
ytd-app[mini-guide-visible] #page-manager.ytd-app {
    margin-left: 0 !important;
}

/* 3. Ensure the video grid expands to fill the void */
#primary.ytd-app, 
ytd-rich-grid-renderer {
    margin-left: 0 !important;
    padding-left: 0 !important;
    width: 100% !important;
}

/* 4. Fix top-bar alignment since the menu button is gone */
ytd-masthead #container.ytd-masthead {
    padding-left: 16px !important;
}
            * { border-radius: 0px !important; font-family: 'Courier New', monospace !important; text-transform: uppercase !important; }
            body { background: #000 !important; color: ${theme} !important; transition: filter 0.5s; }
            
            /* COMPLETE LOGO DESTRUCTION */
            ytd-topbar-logo-renderer #logo, 
            ytd-topbar-logo-renderer .ytd-logo,
            #logo-icon,
            .yt-icon-container.ytd-topbar-logo-renderer { display: none !important; visibility: hidden !important; }

            /* RECENTERED BRANDING IN LOGO SLOT */
            #wayne-core-brand { 
                position: absolute; 
                left: 16px; 
                top: 50%; 
                transform: translateY(-50%);
                color: ${theme}; 
                font-size: 20px; 
                font-weight: 900; 
                letter-spacing: 3px; 
                z-index: 9999; 
                text-shadow: 0 0 10px ${theme}; 
                pointer-events: auto;
                cursor: pointer;
            }

            #guide, ytd-guide-renderer, yt-icon-button#guide-button, #related, #secondary, ytd-merch-shelf-renderer { display: none !important; }

            .ytp-contextmenu, .tp-yt-paper-listbox, ytd-menu-popup-renderer {
                background: rgba(0, 10, 0, 0.95) !important;
                border: 1px solid ${theme} !important;
                box-shadow: 0 0 20px ${theme} !important;
                color: ${theme} !important;
            }

            #wayne-player-hud { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 50; overflow: hidden; }
            #wayne-player-hud::after {
                content: ""; position: absolute; top: -100%; left: 0; width: 100%; height: 100%;
                background: linear-gradient(rgba(18, 16, 16, 0) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(18, 16, 16, 0) 100%);
                animation: scanline-roll 8s linear infinite; z-index: 52;
            }

            .wayne-rec-box { position: absolute; top: 20px; left: 20px; display: flex; align-items: center; z-index: 60; }
            .wayne-dot { width: 12px; height: 12px; background: #ff0000; border-radius: 50% !important; margin-right: 10px; animation: w-blink 1s infinite; }
            
            .wayne-signal { position: absolute; top: 20px; right: 110px; display: flex; align-items: flex-end; gap: 3px; }
            .sig-bar { width: 4px; background: ${theme}; opacity: 0.3; }
            .sig-active { opacity: 1; box-shadow: 0 0 5px ${theme}; }

            .wayne-battery-container { position: absolute; top: 20px; right: 20px; width: 80px; height: 12px; border: 1px solid ${theme}; padding: 2px; }
            #wayne-battery-fill { height: 100%; background: ${theme}; width: 100%; transition: width 0.5s; }

            .w-bracket { position: absolute; width: 40px; height: 40px; border: 2px solid white; opacity: 0.4; }
            .w-tl { top: 20px; left: 20px; border-right: 0; border-bottom: 0; }
            .w-tr { top: 20px; right: 20px; border-left: 0; border-bottom: 0; }
            .w-bl { bottom: 20px; left: 20px; border-right: 0; border-top: 0; }
            .w-br { bottom: 20px; right: 20px; border-left: 0; border-top: 0; }

            .wayne-data-stream { position: absolute; left: 20px; top: 60px; text-align: left; font-size: 10px; color: ${theme}; opacity: 0.7; }
            .wayne-cam-info { position: absolute; bottom: 30px; left: 70px; color: white; font-size: 12px; opacity: 0.8; }
            .wayne-clock-info { position: absolute; bottom: 30px; right: 70px; color: white; font-size: 12px; opacity: 0.8; }

            .thermal-active { filter: invert(1) hue-rotate(180deg) contrast(1.4) saturate(2.5) !important; }
            
            @keyframes w-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            @keyframes scanline-roll { 0% { top: -100%; } 100% { top: 100%; } }
        `;


        // INJECT BRANDING INTO THE TOP BAR CONTAINER
        const topBar = document.querySelector('ytd-topbar-logo-renderer');
        if (topBar && !document.getElementById('wayne-core-brand')) {
            const b = document.createElement('div');
            b.id = 'wayne-core-brand'; 
            b.innerText = 'WAYNETUBE';
            b.onclick = () => window.location.href = '/';
            topBar.appendChild(b);
        }

        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        if (player && !document.getElementById('wayne-player-hud')) {
            const hud = document.createElement('div');
            hud.id = 'wayne-player-hud';
            hud.innerHTML = `
                <div class="wayne-rec-box"><div class="wayne-dot"></div><span style="color:#ff0000; font-weight:900;">REC</span></div>
                <div class="wayne-signal">
                    <div class="sig-bar sig-active" style="height:5px"></div>
                    <div class="sig-bar sig-active" style="height:10px"></div>
                    <div class="sig-bar sig-active" style="height:15px"></div>
                    <div class="sig-bar sig-active" style="height:20px" id="sig-dynamic"></div>
                </div>
                <div class="wayne-battery-container"><div id="wayne-battery-fill"></div></div>
                <div class="wayne-data-stream">ENCRYPTION: ACTIVE<br>KERNEL: V2.1<br>STATUS: ALIGNED</div>
                <div class="w-bracket w-tl"></div><div class="w-bracket w-tr"></div>
                <div class="w-bracket w-bl"></div><div class="w-bracket w-br"></div>
                <div class="wayne-cam-info">CAM_04 // SECURE_LINE</div>
                <div class="wayne-clock-info" id="wayne-live-clock">00:00:00</div>
            `;
            player.appendChild(hud);
        }

        const video = document.querySelector('video');
        const battFill = document.getElementById('wayne-battery-fill');
        if (video && battFill && video.duration) {
            const percentage = 100 - ((video.currentTime / video.duration) * 100);
            battFill.style.width = percentage + "%";
        }

        const clock = document.getElementById('wayne-live-clock');
        if (clock) clock.innerText = new Date().toTimeString().split(' ')[0];
    });
}

window.coreLoop = setInterval(applyV21, 1000);
applyV21();

document.onkeydown = (e) => {
    buffer += e.key.toUpperCase();
    if (buffer.length > 5) buffer = buffer.substring(1);
    if (buffer.includes(secret)) { 
        synth(50, 'sawtooth', 1.5, 0.4); 
        document.body.classList.toggle('thermal-active');
        buffer = "";
    }
};

window.addEventListener('contextmenu', () => { synth(400, 'triangle', 0.1, 0.02); });
