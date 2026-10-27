# Crypt Keeper: Rogue Shovel ⚰️⛏️
**High-Octane 2D Retro Web Roguelike with Online Co-Op & Web Monetization**

---

## 🚀 Quick Start (Play & Test Locally)

### 1. Start the Local Server & Multiplayer Engine
```bash
npm start
```
This starts both the **HTTP Web Game Server** and the **WebSocket Multiplayer Hub** on `http://localhost:3000`.

### 2. Open the Game
* **Player 1 (Host)**: Open `http://localhost:3000` in your browser.
* Click **🌐 CO-OP** in the top-right header:
  * Your active expedition room code is displayed (e.g. `KEEPER-7X9`).
* **Player 2 (Join)**: Open `http://localhost:3000` in a second browser window or another device on the same network:
  * Click **🌐 CO-OP**, enter the host's room code, and click **🔗 JOIN SESSION**.
  * Both players are now in the same dungeon instance with live position, shovel attacks, deflections, dashes, and revive synchronization!
* **Offline / Single Player**: If the server is offline or you're playing solo, the built-in **AI Companion Bot** ("Brother in Shovels") automatically assists you in combat.

---

## 💰 Ad Monetization System (`AdManager`)

The game includes a production-grade Web Monetization architecture supporting **Banners**, **Rewarded Videos**, and **Interstitials**:

### 1. Bottom Responsive Ad Banner
* Styled with dark gothic retro borders to seamlessly blend with the pixel HUD.
* Dynamically resizes the game viewport (`#game-container`) so the canvas, touch joysticks, and buttons are never obstructed.
* Includes a toggle button (`✕`) for players who want a fullscreen view.

### 2. Rewarded Video Ads (High eCPM Revenue)
* **Cheat Death (Ankh of Rebirth)**: On the Game Over screen, players can click **"📺 WATCH AD TO REBIRTH"** to revive with 50% HP and temporary invincibility.
* **Ancient Soul Tribute**: Inside the Sanctuary Soul Altar, players can click **"📺 WATCH SPONSOR: +50 SOULS"** to earn meta-progression currency.
* **Relic Re-Rolls**: Extensible to allow re-rolling relic drafts in treasure chambers.

### 3. Interstitial Ads
* Automatically triggered when progressing between dungeon depths (with a built-in 120-second cooldown to protect player retention).

### 4. Connecting Ad Networks

The `AdManager` is built with a plug-and-play adapter. Open `index.html` (or `scripts/build.js`) and modify `AdManager.config.mode`:

```javascript
AdManager.config = {
    mode: 'simulated', // Options: 'simulated' | 'poki' | 'crazygames' | 'adsense'
    adsenseClientId: 'ca-pub-XXXXXXXXXXXXXXXX',
    adsenseBannerSlot: '1234567890'
};
```

* **Simulated Mode (`'simulated'`)**: Works immediately out-of-the-box for local testing with interactive 5-second reward simulations and rotating retro sponsor banners.
* **Poki SDK (`'poki'`)**: Calls `window.PokiSDK.rewardedBreak()` and `window.PokiSDK.commercialBreak()`.
* **CrazyGames SDK (`'crazygames'`)**: Calls `window.CrazyGames.SDK.ad.requestAd("rewarded")`.
* **Google AdSense / H5 Ads (`'adsense'`)**: Binds standard Google responsive ad slots.

---

## 🌐 Real-Time Multiplayer Architecture (`MultiplayerManager`)

* **Client**: Low-overhead WebSocket client that broadcasts at 25 Hz.
* **Server**: Lightweight Node.js server (`server/server.js`) using the `ws` package.
* **Synchronized Features**:
  * Player position, angle, facing direction, and walk animations.
  * Shovel attack swings, weapon types, dashes, and projectile deflections.
  * Partner downed state & interactive revive radius (standing near your partner revives them).
  * Room and floor depth transitions.
  * Automatic graceful fallback to AI bot if network disconnects.

---

## ☁️ Deployment Guide

### Deploying the Web Client (Static Hosting)
You can deploy `index.html` directly to:
* **GitHub Pages**, **Vercel**, **Netlify**, **Itch.io**, or **Poki / CrazyGames**.
* It loads instantly (<300 KB total size) with zero WASM/WebGL lag.

### Deploying the Multiplayer Server
Deploy `server/server.js` for free on:
* **Render.com** (Free Web Service)
* **Railway.app**
* **Fly.io**
* Simply set the public WebSocket URL in `index.html` (`input-server-url` or `NET_CONFIG.wsUrl`).

---

## 📱 Google Play Store Roadmap (When Ready)

When you're ready to publish this on Google Play Store:
* **No Engine Rewrite Needed**: Because the game is 100% web-native HTML5 Canvas, you do not need to rebuild it in Godot or Unity!
* **Capacitor / Android Studio**:
  ```bash
  npm install @capacitor/core @capacitor/cli @capacitor/android
  npx cap init "Crypt Keeper" "com.cryptkeeper.rogueshovel"
  npx cap add android
  ```
* **Benefits of Web-to-PlayStore**:
  * Exact same codebase for Web, Mobile Web, and Android APK.
  * Google Play In-App Billing and Google AdMob can be added via official Capacitor plugins (`@capacitor-community/admob`).
  * Instant startup time on low-end Android devices.
