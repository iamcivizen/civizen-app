# Civizen Mobile App Test & Build Guide (CapacitorJS)

This archive contains the required assets and configuration files to build and deploy the Civizen mobile app for both **Android** and **iOS** platforms using Ionic Capacitor.

---

## 🛠️ Prerequisites
Before running, ensure you have the following installed on your machine:
1. **Node.js** (v18 or higher recommended)
2. **Android Studio** (for Android build/testing)
3. **Xcode** (for iOS build/testing, macOS required)
4. **Capacitor CLI** (installed automatically via npm dependencies)

---

## 📦 Project Setup & Build Flow

### 1. Install Dependencies
Extract the contents of this zip and run:
```bash
npm install
```

### 2. Build Web Assets
Compile the React/Vite production build bundle into static assets (`dist` folder):
```bash
npm run build
```

### 3. Sync Capacitor Configuration
Generate the native platform builds and sync the built web assets with Capacitor:
```bash
npx cap sync
```

---

## 🤖 1. Testing & Running on Android

### Add Android Platform
If not already added, initialize the Android native directory:
```bash
npx cap add android
```

### Compile & Open in Android Studio
Open the project in Android Studio to build the debug APK or run on a physical device/emulator:
```bash
npx cap open android
```
Once Android Studio loads:
1. Sync Gradle files (if prompted).
2. Select your device/emulator from the top toolbar.
3. Click the **Run** (Green Play) button to install and launch the application.

---

## 🍎 2. Testing & Running on iOS (macOS required)

### Add iOS Platform
If not already added, initialize the iOS native directory:
```bash
npx cap add ios
```

### Compile & Open in Xcode
Open the workspace in Xcode:
```bash
npx cap open ios
```
Once Xcode loads:
1. Select your target device or simulator in the scheme selector.
2. Click the **Play** button to build and run the app.

---
## ⚙️ Capacitor Configuration Details
* **App Name:** Civizen
* **Package ID / Bundle Identifier:** `com.civizen.app`
* **Web Directory:** `dist`
