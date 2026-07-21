<!-- Hero Section -->
<div align="center">
  <img src="https://raw.githubusercontent.com/expo/expo/main/docs/public/static/images/expo-logo.png" alt="Logo" width="120" height="120">
  
  <h1 align="center">🗺️ Smart Field Survey</h1>
  
  <p align="center">
    <strong>A next-generation, high-performance field data collection app built with React Native.</strong>
    <br />
    <br />
    <a href="#-about-the-project"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#-screenshots--ui-walkthrough">View Demo</a>
    ·
    <a href="#-contact">Report Bug</a>
    ·
    <a href="#-contact">Request Feature</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Expo_Router-4630EB?style=for-the-badge&logo=expo&logoColor=white" alt="Expo Router" />
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  </p>
</div>

<hr />

## 📖 Table of Contents

<details>
  <summary>Click to expand</summary>
  
  1. [About The Project](#-about-the-project)
      - [Built With](#%EF%B8%8F-built-with)
  2. [Key Features In-Depth](#-key-features-in-depth)
  3. [Screenshots & UI Walkthrough](#-screenshots--ui-walkthrough)
  4. [Project Architecture](#%EF%B8%8F-project-architecture)
  5. [Getting Started](#-getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
  6. [Permissions Overview](#-permissions-overview)
  7. [Usage](#-usage)
  8. [Contributing](#-contributing)
  9. [License](#-license)
  10. [Contact](#-contact)
</details>

<br />

## 🌍 About The Project

**Smart Field Survey** is designed to transform how remote data collection and surveying tasks are performed. Traditional surveying often involves juggling a camera, a GPS device, a clipboard, and a physical contact book. This app converges all these essential tools into a single, intuitive, and modern mobile interface.

Whether you're an environmental researcher mapping flora, a real estate inspector documenting property conditions, or a utility worker logging infrastructure data, this application acts as your all-in-one digital companion.

### 🛠️ Built With

We leverage the cutting edge of mobile development technologies to ensure smooth performance, native feel, and developer experience.

* [![React Native][React.js]][React-url]
* [![Expo][Expo]][Expo-url]
* [![TypeScript][TypeScript]][TypeScript-url]

<br />

## ✨ Key Features In-Depth

We didn't just build features; we built *workflows*. Click below to explore the core functionalities:

<details>
<summary><strong>📸 Intelligent Camera Integration</strong></summary>
<br/>
Powered by <code>expo-camera</code>, the photo capture module doesn't just take pictures—it prepares them for the survey context. You have full control over the flash, camera flip, and immediate preview of the captured evidence.
</details>

<details>
<summary><strong>📍 Precision GPS Mapping</strong></summary>
<br/>
Using <code>expo-location</code>, the app fetches high-accuracy geographical data (Latitude, Longitude, and Altitude). It requests necessary permissions dynamically and gracefully handles environments where GPS signals might be weak.
</details>

<details>
<summary><strong>👥 Seamless Contact Sync</strong></summary>
<br/>
No need to manually type out client or stakeholder information. With <code>expo-contacts</code>, you can securely open the native address book, select the relevant individual, and instantly bind their details to your current survey.
</details>

<details>
<summary><strong>📋 Advanced Clipboard Utilities</strong></summary>
<br/>
Need to export data quickly to an email or a messaging app? The <code>expo-clipboard</code> integration allows you to bundle your survey (coordinates, contact info, notes) and copy it with a single tap.
</details>

<br />

## 📱 Screenshots & UI Walkthrough

*A visual journey through the application.*

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>📸 Camera View</strong></td>
      <td align="center"><strong>📍 Location & GPS</strong></td>
      <td align="center"><strong>📊 Final Preview</strong></td>
    </tr>
    <tr>
      <td><img src="https://res.cloudinary.com/dpvmzqfvv/image/upload/v1784639848/Screenshot_2026-07-21_184628_gbafz8.png" width="365" alt="Camera"></td>
      <td><img src="https://res.cloudinary.com/dpvmzqfvv/image/upload/v1784639846/Screenshot_2026-07-21_183243_obc4gm.png" alt="Location"></td>
      <td><img src="https://res.cloudinary.com/dpvmzqfvv/image/upload/v1784639846/Screenshot_2026-07-21_183049_b3oswi.png" alt="Preview"></td>
    </tr>
  </table>
</div>

<br />

## 🏗️ Project Architecture

Our codebase is strictly organized using **Expo Router (File-Based Routing)** for maximum scalability and maintainability.

```graphql
app/
 ├── (drawer)/                # 📁 Drawer Navigation Context
 │    ├── (tabs)/             # 📁 Nested Bottom Tabs Navigation
 │    ├── _layout.tsx         # ⚙️ Drawer Layout Configuration
 │    ├── camera-screen.tsx   # 📸 Camera Feature Module
 │    ├── location-screen.tsx # 📍 Geolocation Feature Module
 │    ├── contacts-screen.tsx # 👥 Address Book Feature Module
 │    ├── clipboard-screen.tsx# 📋 Data Export Module
 │    ├── survey-preview.tsx  # 🔍 Aggregated Survey Overview
 │    └── settings-screen.tsx # 🛠️ App Preferences & Config
 ├── assets/                  # 🖼️ Static Images, Fonts, Icons
 ├── components/              # 🧩 Reusable UI Components
 └── constants/               # 🎨 Theme Colors, Layout Constants
```

<br />

## 🚀 Getting Started

Follow these instructions to get a local copy up and running on your machine.

### Prerequisites

Make sure you have Node.js installed. We recommend using `npm` or `yarn` as your package manager.

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/anand880441-source/React_Native/tree/main/Projects/02_Smart_Field_Survey
   ```
2. **Navigate to the project directory**
   ```sh
   cd 02_Smart_Field_Survey
   ```
3. **Install NPM packages**
   ```sh
   npm install
   ```
4. **Boot up the Expo Development Server**
   ```sh
   npx expo start
   ```

### Running on Device / Emulator

Once the Metro bundler is running, use the following keyboard shortcuts in your terminal:
- Press <kbd>a</kbd> for Android Emulator
- Press <kbd>i</kbd> for iOS Simulator
- Press <kbd>w</kbd> for Web Browser
- 📱 Or simply scan the **QR Code** using the **Expo Go** app on your physical iOS or Android device.

<br />

## 🔐 Permissions Overview

Because this app acts as a physical tool replacement, it requires access to physical device sensors.

| Permission | Justification |
| :--- | :--- |
| **`CAMERA`** | Required to allow the surveyor to capture photos of the field environment. |
| **`ACCESS_FINE_LOCATION`** | Necessary to tag the survey data with exact pinpoint coordinates. |
| **`READ_CONTACTS`** | Allows the app to pull client phone numbers/names directly, reducing manual entry errors. |

<br />

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br />

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />

## 💌 Contact

Project Link: [https://github.com/anand880441-source/React_Native/tree/main/Projects/02_Smart_Field_Survey](https://github.com/anand880441-source/React_Native/tree/main/Projects/02_Smart_Field_Survey)

---
<div align="center">
  <p>Crafted with ❤️ for Surveyors Worldwide</p>
</div>

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactnative.dev/
[Expo]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white
[Expo-url]: https://expo.dev/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
