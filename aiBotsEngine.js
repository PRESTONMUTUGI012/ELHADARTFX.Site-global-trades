class TerminalAudioEngine {
    constructor() {
        this.ctx = null;
        this.isEnabled = true;
    }
    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    playTone(freq, type, startTime, duration, volume = 0.15) {
        if (!this.isEnabled) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }
    playProfitChime() {
        if (!this.isEnabled) return;
        this.initContext();
        const now = this.ctx.currentTime;
        this.playTone(523.25, 'triangle', now, 0.18, 0.16);
        this.playTone(659.25, 'triangle', now + 0.09, 0.18, 0.16);
        this.playTone(783.99, 'triangle', now + 0.18, 0.22, 0.18);
        this.playTone(1046.50, 'sine', now + 0.27, 0.45, 0.22);
    }
}

const terminalAudio = new TerminalAudioEngine();

function toggleTerminalAudio() {
    terminalAudio.isEnabled = !terminalAudio.isEnabled;
    if (terminalAudio.isEnabled) terminalAudio.initContext();
    const icon = document.getElementById('audio-status-icon');
    const text = document.getElementById('audio-status-text');
    if (icon && text) {
        icon.innerText = terminalAudio.isEnabled ? '🔊' : '🔇';
        text.innerText = terminalAudio.isEnabled ? 'SFX ON' : 'MUTED';
    }
}

function triggerElhadartProfitAlert(boatLabel, profitAmount) {
    terminalAudio.playProfitChime();
    const banner = document.getElementById('profit-toast-banner');
    const details = document.getElementById('profit-toast-details');
    if (banner && details) {
        details.innerText = `${boatLabel} Secured +$${profitAmount.toFixed(2)} Profit`;
        banner.classList.remove('translate-x-full', 'opacity-0');
        banner.classList.add('translate-x-0', 'opacity-100');
        clearTimeout(window.profitToastTimeout);
        window.profitToastTimeout = setTimeout(() => {
            banner.classList.remove('translate-x-0', 'opacity-100');
            banner.classList.add('translate-x-full', 'opacity-0');
        }, 4000);
    }
}

const speedBoatsDirectory = {
    1: { name: "Boat 1: Smart Money OB Sniper", setup: "Order Block (OB) Tap" },
    2: { name: "Boat 2: Tick Momentum Scalper", setup: "Tick Velocity Surge" },
    3: { name: "Boat 3: Tick Reversal Scalper", setup: "Liquidity Pool Sweep" },
    4: { name: "Boat 4: FVG Rebalance Bot", setup: "Fair Value Gap Fill" },
    5: { name: "Boat 5: BOS Trend Follower", setup: "Break of Structure (BOS)" },
    6: { name: "Boat 6: CHOCH Reversal Hunter", setup: "Change of Character (CHOCH)" },
    7: { name: "Boat 7: Premium/Discount Array", setup: "Trendline Breakout / Retest" },
    8: { name: "Boat 8: Adaptive Parity Shifter", setup: "Even / Odd Parity Bias" },
    9: { name: "Boat 9: Over/Under Matrixer", setup: "Digits 0-4 vs 5-9 Skew" }
};

let currentActiveSpeedBoat = 2;

function switchSpeedBoat(boatId) {
    currentActiveSpeedBoat = boatId;
    const boat = speedBoatsDirectory[boatId];
    if (boat) {
        document.getElementById('active-indicator-status').innerText = `Locked Bot: ${boat.name}`;
    }
}

function executeSpeedBoatTrade() {
    const boat = speedBoatsDirectory[currentActiveSpeedBoat];
    const label = boat ? boat.name : `Speed Boat ${currentActiveSpeedBoat}`;
    triggerElhadartProfitAlert(label, 92.50);
    alert(`Executing ${label} Active Contract Successfully!`);
}

// Strict Unique Setup to Speed Boat Mapping (Zero Loop / Non-Overlapping)
function evaluateAllIndicators(st) {
    if (!st || !st.quotes || st.quotes.length < 20) return;
    
    const quotes = st.quotes;
    const len = quotes.length;
    const currentPrice = quotes[len - 1];
    const prevPrice = quotes[len - 2];
    const isRise = currentPrice >= prevPrice;

    const ma30 = quotes.slice(len - 30, len).reduce((a, b) => a + b, 0) / 30;
    const bias15M = currentPrice >= ma30 ? "15M Bullish Bias" : "15M Bearish Bias";

    const recentHigh = Math.max(...quotes.slice(len - 25, len - 1));
    const recentLow = Math.min(...quotes.slice(len - 25, len - 1));
    
    const isCHOCH = !isRise && currentPrice < recentLow && quotes[len-3] > quotes[len-2];
    const isBOS = isRise && currentPrice > recentHigh;
    const liquiditySweep = Math.abs(currentPrice - recentHigh) < (currentPrice * 0.0002) || Math.abs(currentPrice - recentLow) < (currentPrice * 0.0002);
    const trendlineBreakout = Math.abs(currentPrice - ma30) > (currentPrice * 0.001);

    // UNIQUE NON-OVERLAPPING MAPPING TO SPEED BOATS (1 TO 9)
    let assignedBoatId = 2;
    let uniqueSetupName = "Tick Momentum Surge";

    if (isCHOCH) {
        assignedBoatId = 6; // Boat 6: CHOCH Reversal Hunter
        uniqueSetupName = "Change of Character (CHOCH)";
    } else if (isBOS) {
        assignedBoatId = 5; // Boat 5: BOS Trend Follower
        uniqueSetupName = "Break of Structure (BOS)";
    } else if (liquiditySweep) {
        assignedBoatId = 3; // Boat 3: Tick Reversal Scalper
        uniqueSetupName = "Liquidity Pool Sweep";
    } else if (trendlineBreakout) {
        assignedBoatId = 7; // Boat 7: Premium/Discount Array
        uniqueSetupName = "Trendline Breakout & Retest";
    } else {
        assignedBoatId = 1; // Boat 1: Smart Money OB Sniper
        uniqueSetupName = "Order Block (OB) Tap";
    }

    // Update UI elements securely without loops
    const structEl = document.getElementById('structure-confluence-status');
    if (structEl) structEl.innerText = `${bias15M} • ${uniqueSetupName}`;

    const indStatusEl = document.getElementById('active-indicator-status');
    if (indStatusEl) indStatusEl.innerText = `${uniqueSetupName} ➔ Assigned: ${speedBoatsDirectory[assignedBoatId].name}`;

    // Tick Contract
    const tickDisplay = document.getElementById('tick-contract-display');
    if (tickDisplay) {
        tickDisplay.innerText = `${isRise ? "Rise (CALL)" : "Fall (PUT)"} (3 Ticks) @ ${currentPrice.toFixed(2)}`;
    }

    // Swing Hold Contract
    const swingDisplay = document.getElementById('swing-contract-display');
    if (swingDisplay) {
        swingDisplay.innerText = `${bias15M.includes("Bullish") ? "Rise Hold" : "Fall Hold"} (15M Candle, TP: +25 pips)`;
    }

    const badge = document.getElementById('rise-fall-signal-badge');
    if (badge) {
        badge.innerText = isRise ? "RISE (CALL)" : "FALL (PUT)";
        badge.className = isRise
            ? "text-[10px] font-mono font-bold text-fxgreen bg-emerald-950 px-2 py-1 rounded border border-emerald-700"
            : "text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-2 py-1 rounded border border-rose-700";
    }
}
