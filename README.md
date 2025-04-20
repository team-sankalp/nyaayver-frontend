
---

# 📱 NyaayVeer – Mobile Frontend

Welcome to the official **frontend** for **NyaayVeer**, a mobile application designed to assist users in understanding criminal law by providing relevant sections from the **Bharatiya Nyaya Sanhita (BNS)** based on user-submitted case descriptions.

This repository contains the React Native mobile interface that interacts with the AI backend to deliver a smooth, intelligent legal experience to the user.

---

## ✅ Prerequisites

Ensure the following tools are installed and properly configured on your system:

- **Android Studio**
- **Android SDK**
- **React Native CLI**
- **Node.js (LTS version recommended)**

---

## 🚀 Setup Instructions

Follow these steps to get the mobile frontend running on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nyaayveer-frontend.git
cd nyaayveer-frontend
```

### 2. Create a `.env` File

In the root directory, create a `.env` file with the following:

```env
REACT_APP_BASE_URL=http://127.0.0.1:5000
```

> 🔁 Replace the URL above with the actual URL of your running backend (hosted locally or on a remote server).

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application on Android

Make sure an Android emulator is running (or a physical device is connected), then run:

```bash
npm run android
```

---

## 🧩 How It Fits In

This frontend is the user-facing part of the NyaayVeer application. It connects with the backend API to send criminal case descriptions and receive corresponding legal sections in return — enabling a simple, accessible legal interface for users.

---

## ⚖️ Jai Nyaay!

Bringing accessible legal guidance to all, one case at a time.

---
