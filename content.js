/**
 * PROJECT: Surveillance-Interface-for-YouTube
 * OPERATOR: Wayne Core (samwelwayne266-coder)
 * STATUS: KERNEL_OPERATIONAL
 * BREACH_CODE: WAYNE
 */

let audioCtx;
let buffer = "";
const secret = "WAYNE";

function synth(f, t, d, v = 0.04) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(v, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + d);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + d);
}

function applyV29() {
    chrome.storage.local.get(['uiColor'], (data) => {
        const theme = data.uiColor || "#00ccff";

        let style = document.getElementById('wayne-core-v29-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'wayne-core-v29-style';
            document.head.appendChild(style);
        }

        style.innerHTML = `
            * { border-radius: 0px !important; font-family: 'Courier New', monospace !important; text-transform: uppercase !important; }
            body { background: #000 !important; color: ${theme} !important; }

            /* INTERFACE SUPPRESSION */
            #guide, ytd-guide-renderer, yt-icon-button#guide-button, #related, #secondary, #comments { display: none !important; }

            /* INTERNAL PLAYER HUD */
            #wayne-player-hud {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: 50; box-sizing: border-box;
            }

            /* TOP LEFT REC */
            .wayne-rec-box { position: absolute; top: 20px; left: 20px; display: flex; align-items: center; z-index: 60; }
            .wayne-dot { width: 12px; height: 12px; background: #ff0000; border-radius: 50% !important; margin-right: 10px; animation: w-blink 1s infinite; }
            .wayne-rec-text { color: #ff0000; font-size: 16px; font-weight: 900; text-shadow: 2px 2px 2px #000; }
            
            #wayne-low-bat { 
                margin-left: 15px; color: #ffcc00; font-size: 12px; display: none; 
                animation: w-blink 0.5s infinite; border: 1px solid #ffcc00; padding: 2px 4px; background: rgba(0,0,0,0.5);
            }

            /* PLAYER BRACKETS */
            .w-bracket { position: absolute; width: 30px; height: 30px; border: 2px solid white; opacity: 0.6; }
            .w-tl { top: 15px; left: 15px; border-right: 0; border-bottom: 0; }
            .w-tr { top: 15px; right: 15px; border-left: 0; border-bottom: 0; }
            .w-bl { bottom: 15px; left: 15px; border-right: 0; border-top: 0; }
            .w-br { bottom: 15px; right: 15px; border-left: 0; border-top: 0; }

            /* CAM METADATA */
            .wayne-cam-info { position: absolute; bottom: 20px; left: 20px; color: white; font-size: 12px; text-shadow: 1px 1px 1px #000; opacity: 0.8; }
            .wayne-clock-info { position: absolute; bottom: 20px; right: 20px; color: white; font-size: 12px; text-shadow: 1px 1px 1px #000; opacity: 0.8; }

            /* END-OF-STREAM INTERFERENCE */
            .interference-active { animation: jitter 0.15s infinite !important; filter: contrast(1.5) brightness(1.3) sepia(0.2) !important; }

            @keyframes w-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            @keyframes jitter {
                0% { transform: translate(0,0); }
                25% { transform: translate(-3px, 1px); }
                75% { transform: translate(3px, -1px); }
                100% { transform: translate(0,0); }
            }

            #wayne-core-brand { color: ${theme}; font-size: 24px; font-weight: 900; letter-spacing: 5px; text-shadow: 0 0 10px ${theme}; padding: 10px; }
        `;

        // INJECT HUD DIRECTLY INTO PLAYER
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        if (player && !document.getElementById('wayne-player-hud')) {
            const hud = document.createElement('div');
            hud.id = 'wayne-player-hud';
            hud.innerHTML = `
                <div class="wayne-rec-box">
                    <div class="wayne-dot"></div>
                    <span class="wayne-rec-text">REC</span>
                    <span id="wayne-low-bat">LOW_BATTERY</span>
                </div>
                <div class="w-bracket w-tl"></div><div class="w-bracket w-tr"></div>
                <div class="w-bracket w-bl"></div><div class="w-bracket w-br"></div>
                <div class="wayne-cam-info">CAM_01 // SOURCE: CORE</div>
                <div class="wayne-clock-info" id="wayne-live-clock">00:00:00</div>
            `;
            player.appendChild(hud);
        }

        // MONITOR VIDEO FOR LOW BATTERY & JITTER
        const video = document.querySelector('video');
        const batLabel = document.getElementById('wayne-low-bat');
        if (video && !isNaN(video.duration)) {
            const timeLeft = video.duration - video.currentTime;
            if (timeLeft < 6 || video.ended) {
                if (batLabel) batLabel.style.display = 'inline-block';
                video.classList.add('interference-active');
            } else {
                if (batLabel) batLabel.style.display = 'none';
                video.classList.remove('interference-active');
            }
        }

        // UPDATE CLOCK
        const clock = document.getElementById('wayne-live-clock');
        if (clock) {
            const now = new Date();
            clock.innerText = now.toTimeString().split(' ')[0] + ":" + Math.floor(Math.random()*99);
        }

        // BRANDING
        const logo = document.querySelector('ytd-topbar-logo-renderer, #logo');
        if (logo && !document.getElementById('wayne-core-brand')) {
            logo.querySelectorAll('svg, img, .yt-icon').forEach(e => e.style.display = 'none');
            const l = document.createElement('div');
            l.id = 'wayne-core-brand'; l.innerText = 'WAYNE_CORE';
            logo.prepend(l);
        }
    });
}

document.onkeydown = (e) => {
    buffer += e.key.toUpperCase();
    if (buffer.length > 5) buffer = buffer.substring(1);
    if (buffer.includes(secret)) { 
        synth(50, 'sawtooth', 1.5, 0.4); 
        document.body.style.filter = "invert(1) contrast(2)";
        setTimeout(() => document.body.style.filter = "", 250);
        buffer = "";
    }
    synth(850, 'square', 0.02);
};

setInterval(applyV29, 500);
applyV29();
