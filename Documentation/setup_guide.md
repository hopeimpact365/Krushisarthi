# Developer Onboarding & Setup Guide: Krushisarthi

This step-by-step guide is designed to help new developers configure their local workstations and get Krushisarthi up and running from scratch.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:
* **Node.js** (v18.x or higher recommended)
* **npm** (v9.x or higher)
* **MongoDB** (A local community edition or a free-tier database on MongoDB Atlas)
* **Git** for version control

---

## 2. Clone the Repository

Clone the project repository to your local directory:
```bash
git clone https://github.com/BhargavK001/Krushisarthi.git
cd Krushisarthi
```

---

## 3. Backend Setup

The backend is built with Node.js, Express, and Mongoose.

### 3.1. Install Dependencies
Navigate to the backend directory and download the packages:
```bash
cd backend
npm install
```

### 3.2. Set Up Environment Variables
Create a `.env` file in the root of the `backend` folder. Copy the template from `.env.example`:
```bash
cp .env.example .env
```

Open `.env` and fill in the configuration values:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/krushisarthi?retryWrites=true&w=majority
JWT_SECRET=super_secret_minimum_32_characters_long_jwt_key
RAZORPAY_KEY_ID=rzp_test_YourKeyId
RAZORPAY_KEY_SECRET=YourRazorpaySecret
RESEND_API_KEY=re_YourResendApiKey
RESEND_FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=your_email@example.com
FRONTEND_URL=http://localhost:3000
```

### 3.3. Run the Backend Server
Start the server in development mode (with live reload via `nodemon` or standard reload):
```bash
# In development (starts server on port 5000)
npm run dev

# Or start in standard/production mode
npm start
```
Check that the server is active by navigating to `http://localhost:5000/` in your browser. You should see the visual telemetry dashboard.

---

## 4. Frontend Setup

The frontend is a Next.js App Router project styled with Tailwind CSS.

### 4.1. Install Dependencies
Navigate to the frontend folder and install the required modules:
```bash
cd ../frontend
npm install
```

### 4.2. Configure Local Environment
Create a `.env.local` file inside the `frontend` folder:
```bash
cp .env.example .env.local
```

Modify `.env.local` to point to the backend API port:
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4.3. Run the Next.js Dev Server
Launch the client application:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser. You can now select products, proceed through the checkout flow, and place orders.

---

## 5. Development Workflow & Troubleshooting

### 5.1. Common Issues and Fixes

#### 1. Port Conflicts (Address Already in Use)
If you see an error like `EADDRINUSE: address already in use :::5000`:
* *Fix:* Another process is holding port 5000. Stop it, or change the `PORT` variable in the backend `.env` file (e.g., `PORT=5001`), and update `NEXT_PUBLIC_API_URL` in the frontend `.env.local` to match.

#### 2. CORS Exceptions
If orders fail to submit and console log shows a CORS origin block:
* *Fix:* Ensure the backend knows your frontend address. Add your specific client origin (e.g. `http://localhost:3000` or local network IP) to the backend `allowedOrigins` list or configure `FRONTEND_URL` in the backend `.env` correctly.

#### 3. Database is Not Connected
If you get database timeouts on `/api/orders`:
* *Fix:* Check your `MONGODB_URI` password encoding. If your database password contains special characters (like `@`, `:`, `/`), make sure they are percent-encoded, or create a password containing only alphanumeric characters.

### 5.2. Admin Login Credentials
For local development, if environment variables `ADMIN1_EMAIL` or `ADMIN2_EMAIL` are not specified, the system defaults to:
* **Admin 1:** `admin1@krushisarthi.com` / Password: `admin123`
* **Admin 2:** `admin2@krushisarthi.com` / Password: `admin456`
You can use these credentials to gain access to the fulfillment system at `http://localhost:3000/admin`.
