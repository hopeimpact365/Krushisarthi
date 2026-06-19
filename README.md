# 🌱 Krushisarthi

> **Bridging local agriculture and modern commerce.** A high-performance, premium web application that connects urban consumers with traditional jaggery farmers in Kolhapur, Maharashtra.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Stack](https://img.shields.io/badge/tech--stack-Next.js%20%7C%20Node.js%20%7C%20MongoDB-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

Krushisarthi provides a seamless jaggery order placement platform coupled with a virtual farm monitoring portal. Customers can buy pure natural jaggery directly, track the lifecycle of their associated sugarcane crops, and print GST-compliant tax invoices, while administrators manage order logistics and system diagnostics through a secure backend operations control panel.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express, Mongoose (MongoDB Atlas integration), Helmet, Express Rate Limiter
* **Third-Party APIs:** Easebuzz Payments, Resend Email Service

### High-Level Architecture
```
┌───────────────────────────────────────┐
│        Next.js App Client             │
│        (Port 3000 / Vercel)           │
└──────────────────┬────────────────────┘
                   │
                   │ HTTPS API Requests
                   ▼
┌───────────────────────────────────────┐
│        Express.js API Server          │
│        (Port 5000 / Render)           │
└────┬─────────────────────────────┬────┘
     │                             │
     ▼ Mongoose ODM                ▼ HTTPS Client
┌──────────────┐             ┌──────────────┐
│  MongoDB     │             │ Easebuzz /   │
│  Atlas       │             │ Resend APIs  │
└──────────────┘             └──────────────┘
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Server Setup
```bash
cd backend
npm install
# Copy the env template and customize the database URIs and key tokens
cp .env.example .env
# Run in development mode (starts http://localhost:5000)
npm run dev
```

### 2. Frontend Client Setup
```bash
cd frontend
npm install
# Copy the local configuration template
cp .env.example .env.local
# Run the client app (starts http://localhost:3000)
npm run dev
```

---

## 📚 Project Documentation Hub

We have prepared comprehensive documentation files inside the `Documentation` folder for deep-dives into the codebase and deployment structure:

| Document | Purpose |
| :--- | :--- |
| 📖 **[Developer Onboarding & Setup Guide](file:///C:/Users/Lenovo/Documents/GitHub/Krushisarthi/Documentation/setup_guide.md)** | Step-by-step instructions to configure databases, payments, and environment variables locally. |
| 🧱 **[Technical Architecture & Schema](file:///C:/Users/Lenovo/Documents/GitHub/Krushisarthi/Documentation/architecture.md)** | Subsystem breakdowns, flowcharts, data schemas, index optimizations, and folder maps. |
| 🔌 **[API Reference Manual](file:///C:/Users/Lenovo/Documents/GitHub/Krushisarthi/Documentation/api_reference.md)** | Catalog of REST API endpoints, request payloads, success structures, and status codes. |
| 🎨 **[Design Specification Manual](file:///C:/Users/Lenovo/Documents/GitHub/Krushisarthi/Documentation/design_specification.md)** | Token definitions, page visual layout guides, images directory, and color guidelines. |
| 📈 **[Optimization & Security Checklist](file:///C:/Users/Lenovo/Documents/GitHub/Krushisarthi/Documentation/optimization_checklist.md)** | Lists performance steps, bundle split optimizations, SEO strategies, and audits. |

---

## 💡 Key App Features

* **5kg Cart Throttle:** Restricts cart selections exceeding `5.0 kg` in combined weight for logistical safety, notifying users dynamically via clear error banners.
* **OTP Verification Simulation:** Wizard-driven user checkout system that requires verified phone identification before collecting shipping coordinates.
* **Confetti Ceremony & GST Invoicing:** Interactive order confirmation screen that renders custom itemized GST tax invoices, with instant local download functionality.
* **Admin telemetry visualizer:** Standard HTML admin route at the API port that provides raw host hardware usage, memory levels, and database latency counts.
* **Interactive Fulfillment Panel:** Protected administrative view for managing state flow updates, tracking delivery zones, and bulk processing orders.

---

## 📄 License
This project is licensed under the MIT License.
