# Shelly EM Monitor

React Native / Expo app that shows real-time energy data from a [Shelly EM](https://shelly-api-docs.shelly.cloud/gen1/#shelly-em-status) device installed at home. It reads solar production and grid exchange to help you understand your energy balance at a glance.

---

## How the home screen works

When the app has a valid configuration, `HomeScreen` starts a polling loop using `setInterval`. On each tick it calls `fetch` against the Shelly `/status` endpoint and updates the three gauges with the fresh values. The interval is **2.5 s** for local access and **4 s** for cloud access (to stay within Shelly Cloud rate limits).

The polling is driven by a `useEffect` that depends on the settings values. Any time a setting changes the old interval is cleared and a new one starts immediately. If a fetch fails the interval is cancelled and an error dialog appears — you can dismiss it or jump straight to Settings to fix the config.

### Shelly API

The app reads `emeters[0]` (grid) and `emeters[1]` (solar) from the response:

```
GET http://<device-ip>/status
```

See the full spec: [Shelly EM status API](https://shelly-api-docs.shelly.cloud/gen1/#shelly-em-status)

---

## Gauges

The home screen shows three arc gauges side by side:

| Gauge | Icon | Source | Range | Meaning |
|-------|------|--------|-------|---------|
| **Solar** | ☀ | `emeters[1].power` | 0 – 3 500 W | Watts currently produced by the solar panels |
| **Grid** | ⚡ | `emeters[0].power` | −3 500 – +3 500 W | Positive = drawing from the grid · Negative = selling to the grid |
| **House** | 🏠 | `grid + solar` (computed) | 0 – 5 000 W | Total power consumed inside the house |

Values are displayed in **kW** below each gauge.

### Status banner

A contextual banner appears below the gauges in three situations:

- **Best situation** (green) — solar > 100 W and grid is near zero (−400 to +400 W): you are consuming exactly what you produce.
- **Selling to the grid** (blue) — grid is negative: surplus solar is being exported.
- **Near the limit** (red) — grid > 2 300 W: you are close to the contract limit, stop using heavy appliances.

---

## Settings

Open Settings from the top-right button on the home screen.

### General

| Setting | Description |
|---------|-------------|
| **Dark Mode** | Toggle between light and dark theme. Preference is persisted across restarts via Expo SecureStore. |

### Cloud

Use this mode when you are away from home or your device is behind a firewall.

| Setting | Description |
|---------|-------------|
| **Use Cloud** | Enable Shelly Cloud polling instead of direct local access. |
| **Cloud URL** | Base URL of the Shelly Cloud server (e.g. `https://shelly-xx-eu.shelly.cloud`). |
| **Auth Key** | Your Shelly Cloud auth key. Stored securely. |
| **Device ID** | The numeric ID of your Shelly device in the cloud. |

All three fields must be filled and the URL must be valid before polling starts.

### Local

Use this mode when your phone is on the same Wi-Fi as the device.

| Setting | Description |
|---------|-------------|
| **Local IP** | IP address of the Shelly device on your LAN (e.g. `192.168.1.100`). |

The app validates the format as you type and shows a green/red hint. Settings are saved when a field loses focus and persisted via SecureStore.

---

## Development

```bash
npm start          # Expo dev server — scan QR or press a / i / w
npm run android    # Run on Android emulator / connected device
npm run ios        # Run on iOS simulator
npm run web        # Run in browser
```

---

## Build a debug APK for Android (no Play Store)

The `android/` folder was generated with `expo prebuild` and is committed to the repo. You do not need to run prebuild again unless you change native config in `app.json`.

### Prerequisites

- Android Studio installed with the Android SDK
- `ANDROID_HOME` environment variable set (or configured in Android Studio)
- Java 17+ in your `PATH`

### Steps

1. **Install JS dependencies** (if you haven't yet):
   ```bash
   npm install
   ```

2. **Build the APK with Gradle**:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   On Windows use `gradlew.bat assembleDebug` instead of `./gradlew`.

3. **Find the APK**:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Install on your device** via ADB:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```
   Or copy the file to the device and open it from the file manager (enable *Install from unknown sources* in Android settings first).

### Release APK (optional)

For a release build (smaller, faster) without signing for store distribution:

```bash
cd android
./gradlew assembleRelease
```

APK will be at `android/app/build/outputs/apk/release/app-release-unsigned.apk`.

> **Note**: a release build requires a signing key. For a personal sideloaded APK it is easiest to just use the debug build above.
