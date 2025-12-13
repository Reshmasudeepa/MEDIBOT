# MediBot - AI-Powered Health Assistant 🏥🤖

<p align="center">
  <img src="assets/medibot-banner.png" alt="MediBot Banner" width="100%"/>
</p>

[![Next.js](https://img.shields.io/badge/Next.js-13+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-06B6D4)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-success)](https://web.dev/progressive-web-apps/)

---

## 🌟 Overview

**MediBot** is an advanced **AI-powered healthcare assistant** designed to bridge the gap between patients and immediate medical support. It serves as a 24/7 intelligent companion that answers health questions, manages medications, and helps schedule appointments.

### 🚀 Key Features

| Feature | Description | Tech/Al |
| :--- | :--- | :--- |
| **🤖 AI Health Chat** | Real-time accurate responses for symptoms & first aid | **Google Gemini SDK** / **Groq** / **xAI** |
| **💊 Smart Reminders** | Automated medication reminders via Email & Push | **Cron Jobs** + **FCM** + **Nodemailer** |
| **👀 Prescription Analysis**| Analyze prescription images to extract meds & dosages | **Gemini Vision (Multimodal)** |
| **🎤 Voice Interaction** | Hands-free consultations | **OpenAI Whisper** |
| **📍 Healthcare Locator** | Find nearby hospitals & pharmacies | **Google Maps API** |
| **📅 Appointments** | Schedule & manage doctor visits | **Firestore Real-time Sync** |
| **📊 Health Dashboard** | Track BMI, Blood Pressure, & download reports | **Recharts** + **PDF Generaton** |

---

## 🛠️ Technology Stack

*   **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI
*   **Backend:** Next.js API Routes (Serverless), Firebase Cloud Functions
*   **Database:** Google Firestore (NoSQL Real-time DB)
*   **AI Models:** Google Gemini Pro, Groq (Llama), xAI (Grok), OpenAI
*   **Authentication:** Firebase Auth
*   **Notifications:** Firebase Cloud Messaging (Push), Resend / Nodemailer (Email)
*   **Payments:** Razorpay / PhonePe Integration

---

## 📱 Installation & Quick Start

### Prerequisites
*   Node.js 18+
*   npm / yarn
*   Firebase account

### Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/medibot.git
    cd medibot
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and populate it with your keys.
    ```bash
    cp .env.example .env.local
    ```

    **Critical Environment Variables:**
    ```env
    # Firebase Client
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    
    # AI Models
    NEXT_PUBLIC_GEMINI_API_KEY=...
    NEXT_PUBLIC_GROQ_API_KEY=...
    NEXT_PUBLIC_GROK_API_KEY=...   # for xAI

    # Payments (Optional)
    RAZORPAY_KEY_ID=...
    RAZORPAY_KEY_SECRET=...
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📘 Developer Guide & Architecture

### Why Next.js 15 & App Router?
We use Next.js 15 for its **Server-Side Rendering (SSR)** capabilities, crucial for SEO and initial load performance. The **App Router** enables **React Server Components**, allowing direct database access (Firestore) on the server before sending HTML to the client, reducing bundle size.

### Real-time Data Strategy (NoSQL)
We chose **Firestore** (NoSQL) over SQL because MediBot requires real-time features like chat and appointment syncing. Firestore's snapshot listeners make syncing UI changes instant.

### Notification Reliability
One of the biggest challenges was ensuring medication reminders fire even when the browser is closed. We solved this with a **Hybrid System**:
1.  **Frontend:** Uses the `Notification` API for active sessions.
2.  **Backend Fallback:** Firebase Cloud Functions (Cron Jobs) run every minute to check for due reminders and strictly send **Emails** or **Push Notifications** (FCM) to the user's device.

### Payment Security
We do not trust client-side payment success states. Instead, we use **Server-Side Webhooks**. When a payment completes (Razorpay/PhonePe), the provider calls our secure API route. We cryptographically verify the signature/checksum before updating the user's `isPremium` status in the database.

---

## 📂 Project Structure

*   `app/` - Next.js App Router pages and layouts
*   `components/` - Reusable UI components (Shadcn/UI)
*   `lib/` - Utility functions, Firebase init, AI config
*   `hooks/` - Custom React hooks (useAuth, etc.)
*   `functions/` - Firebase Cloud Functions (Backend logic)

---

## 📄 License
This project is licensed under the MIT License.
