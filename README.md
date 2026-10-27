# Crypt Keeper: Rogue Shovel ⚰️⛏️
**High-Octane 2D Retro Web Roguelike with Online Co-Op & Web Monetization**

---

## 🚀 Quick Start (Play & Test Locally)

### 1. Start the Local Server & Multiplayer Engine
```bash
npm start
```
This starts both the **HTTP Web Game Server** and the **WebSocket Multiplayer Hub** on `http://localhost:3000`.

### 2. Open the Game & Test 6-Player Co-Op
* **Player 1 (Host)**: Open `http://localhost:3000` in your browser.
  * Click **🌐 CO-OP SQUAD (UP TO 6 PLAYERS)** on the Home Screen.
  * A real room code is automatically generated (e.g. `KEEPER-ABC`).
  * Slot 1 displays: `👑 P1 (HOST / YOU) - Expedition Leader`.
  * Click **🔗 COPY INVITE LINK** (copies `http://localhost:3000/?room=KEEPER-ABC` to your clipboard) or **📋 COPY CODE**.
* **Player 2 to 6 (Joiners)**:
  * Open the invite link `http://localhost:3000/?room=KEEPER-ABC` in another tab, browser window, or another device!
  * Joiner automatically connects as **P2**, **P3**, etc.
  * On Player 2's screen:
    * Slot 1 shows: `👑 P1 (HOST)`
    * Slot 2 shows: `P2 (YOU)` (highlighted with cyan ring)
    * The Start button displays: `⏳ WAITING FOR HOST (P1) TO START...`
  * On Player 1's screen:
    * Slot 2 updates live to show: `P2 KEEPER (Connected)`
    * Squad counter updates to: `2 / 6 KEEPERS`
    * The button displays: `🚀 START EXPEDITION (ENTER DUNGEON)`
* **Launching the Expedition**:
  * Player 1 clicks **🚀 START EXPEDITION**.
  * Both tabs enter the catacombs simultaneously with the exact same seed, room layout, enemies, dirt mounds, and chests!
  * Movement, shovel attacks, weapons, enemy damage, and excavations are synchronized in lockstep with zero jitter.
* **Offline / Single Player**: If the server is offline or you click **⚔️ START SOLO GAME**, you delve solo with an optional built-in **AI Companion Bot** ("Brother in Shovels").

---

## 💰 Ad Monetization System (`AdManager`)

The game includes a production-grade Web Monetization architecture supporting **Banners**, **Rewarded Videos**, and **Interstitials**:

### 1. Bottom Responsive Ad Banner
* Styled with dark gothic retro borders to seamlessly blend with the pixel HUD.
* Dynamically resizes the game viewport (`#game-container`) so the canvas, touch joysticks, and buttons are never obstructed.
* Includes a toggle button (`✕`) for players who want a fullscreen view.

### 2. Rewarded Video Ads (High eCPM Revenue)
* **Revive / Cheat Death**: On the Game Over modal, players can click **"📺 WATCH ADS TO REVIVE (50% HP)"** (or from the floating Ghost Spectator HUD) to revive with 50% HP and temporary invincibility, broadcasting the resurrection to all multiplayer teammates.
* **Ancient Soul Tribute**: Inside the Sanctuary Soul Altar, players can click **"🎬 +50 SOULS"** to earn meta-progression currency.
* **Relic Re-Rolls**: Extensible to allow re-rolling relic drafts in treasure chambers.

### 3. Death & Ghost Spectator Mode (`👻 GHOST SPECTATOR`)
When a player's health drops to 0, the Game Over modal displays 3 clear, dedicated options:
1. **📺 WATCH ADS TO REVIVE (50% HP)**: Watch a rewarded sponsor ad to instantly resurrect with 50% HP, spawn rebirth motes, and clear ghost state.
2. **👻 SPECTATE AS A GHOST**: Transition into ethereal Ghost Spectator form:
   * **Ghost Avatar**: Custom pixel-art spirit sprite (`ghost_0`, `ghost_1`) with bobbing floating animation, translucent aura, glowing cyan halo ring, and overhead label: `👻 GHOST SPECTATOR`.
   * **Noclip Free Flight**: Fly across the catacombs without colliding with walls or taking damage from traps/enemies (WASD, arrow keys, touch joysticks).
   * **Multiplayer Teammate Sync**: Alive teammates see their fallen comrade floating around as a translucent ghost marked `👻 P2 (GHOST)`.
   * **Floating Spectator HUD**: Displays on-screen buttons to **📺 WATCH AD TO REVIVE**, **👥 TO SQUAD** (instant snap to living teammates), and **🏠 MENU**.
3. **🏠 RETURN TO MAIN MENU**: Cleanly leaves any active session and returns to the Title/Home Screen.

### 4. Enemy Shield Synchronization
* Frontal shields (such as the Gargoyle Warden's tank shield) are authoritatively synchronized across Host and all Peers with synchronized `shielded` and `stunTimer` fields, ensuring identical visuals and defensive blocking on all screens.

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

---

## 👤 User Accounts & Direct Freeplay (Guest Mode)

Crypt Keeper features a dual-tier identity and progression system designed to maximize player conversion:

### 1. Direct Freeplay (Guest Mode)
* **Zero Friction**: Players can jump into Solo or 6-Player Co-Op with zero signups or popups.
* **Ephemeral Progress**: As requested, in Guest Mode, Soul Shards, weapon upgrades, and depth milestones are kept in runtime session memory only. They are **NOT saved** to `localStorage` or the server, resetting cleanly if the browser tab is closed or refreshed.
* **Guest Warning Badge**: A subtle notification on the Home Screen and Game Over modal reminds guests that their run loot will not be retained across sessions unless saved to an account.

### 2. User Account (Persistent Cloud Save)
* **Cross-Device Persistence**: Registering with a username and password unlocks persistent cloud saving. Soul Shards, depth records, and weapon upgrades sync automatically across devices.
* **Native Cryptographic Security**: Built using Node.js built-in `crypto.scryptSync` with random salt generation and constant-time `timingSafeEqual` comparison (zero third-party bloat or native C++ compilation issues).
* **1-Click Guest Loot Claim**: If a guest achieves a high score or collects valuable Soul Shards during an expedition, they can click **"💾 SAVE TO ACCOUNT"** on the Game Over screen or in the Auth modal. Checking *"Claim current session loot"* instantly transfers their live run's Shards and Depth into their newly registered cloud account!

---

## 🌐 Deploying to Render.com (Safe Isolation with Capstone Project)

### ⚠️ Will this touch or affect my existing Capstone Project?
**NO, 100% NOT.**
* Render organizes applications into independent **Web Services**.
* Your Capstone project is its own Web Service linked to its own repository (e.g. `capstone.onrender.com`).
* Crypt Keeper will be created as a completely new, separate Web Service (e.g. `crypt-keeper.onrender.com`).
* Both services have **zero shared resources**: separate git branches/repos, separate memory/CPU, separate ports, and independent deploy lifecycles. Modifying or redeploying Crypt Keeper will **NEVER** touch or disturb your Capstone project.

### 🚀 3-Minute Deployment Steps

#### Option 1: Automatic Blueprint (Recommended)
1. Push this repository to your GitHub:
   ```bash
   git add .
   git commit -m "feat: 6-player lockstep co-op, auth, and monetization"
   git push origin main
   ```
2. Log into [dashboard.render.com](https://dashboard.render.com/).
3. Click **New +** at the top right and select **Blueprint**.
4. Connect this GitHub repository. Render will automatically detect `render.yaml` and configure the Web Service with:
   * **Runtime**: Node
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
5. Click **Apply**. Render will compile the game and deploy it with a live `https://<your-service-name>.onrender.com` URL and full WebSocket (`wss://`) support out of the box!

#### Option 2: Manual Dashboard Creation
1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Select your `2d roguelike web game` GitHub repository.
3. Configure the service settings:
   * **Name**: `crypt-keeper-roguelike` (or any custom name)
   * **Region**: Oregon (or your preferred region)
   * **Branch**: `main`
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
   * **Instance Type**: `Free`
4. Click **Deploy Web Service**.
5. Once live, open your `.onrender.com` URL in your browser. Send the invite link to friends to test 6-player online co-op from anywhere in the world!
