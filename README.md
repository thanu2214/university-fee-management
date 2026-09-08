# University Fee Management System (Full-Stack)

A complete, enterprise-grade **University Fee Management System** built with **Java 21 LTS**, **Spring Boot 3.2.5**, and **React.js (Pure JavaScript + JSX, zero TypeScript)**.

---

## 🚀 Quick Local Setup

### 1. Backend (Spring Boot 3 + Java 21)
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on: `http://localhost:8080`*

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 🔑 Pre-Configured Demo Accounts

| Role | Username | Password | Persona & Initial State |
| :--- | :--- | :--- | :--- |
| **Student (Has Dues)** | `student1` | `password123` | **Aarav Sharma** (B.Tech CSE, Sem 3, $30,000 Pending Dues) |
| **Student (Paid)** | `student2` | `password123` | **Sophia Chen** (MBA Finance, Sem 1, Fully Paid) |
| **Finance Officer** | `finance1` | `password123` | **Robert Sterling** (Senior Accounts Officer) |
| **Administrator** | `admin` | `password123` | **Dr. Eleanor Vance** (Campus Super Admin & Bursar) |

*(The login screen also includes 1-click Quick-Fill buttons for each persona!)*

---

## 📦 How to Push to Your GitHub Account

1. Open your terminal in the project root:
```bash
cd "c:\University Fee Managemant System"
```

2. Initialize Git and make the initial commit:
```bash
git init
git add .
git commit -m "feat: complete University Fee Management System"
```

3. Create a **New Repository** on your GitHub account (e.g. `university-fee-management-system`).

4. Link and push to your GitHub repository:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

---

## 🌐 How to Deploy Frontend to Netlify

### Option A: Via Netlify Web Dashboard (Recommended & Easiest)
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Choose **GitHub** and select your repository.
4. Set the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` (or `dist`)
5. Click **Deploy Site**.

### Option B: Netlify CLI
```bash
cd frontend
npx netlify-cli deploy --prod
```

### 🔗 Connecting Frontend to Production Backend:
In your Netlify Site Settings:
1. Go to **Site Configuration** > **Environment variables**.
2. Add a new variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-app.onrender.com/api` (URL of your deployed backend).
3. Trigger a redeploy.

---

## ☁️ How to Deploy Backend (Free on Render / Railway)

### Deploy on Render (Web Service):
1. Log in to [Render.com](https://render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render will automatically detect `backend/Dockerfile`)
   - **Plan**: Free
5. Click **Create Web Service**. Once deployed, copy your backend URL (e.g. `https://feems-backend.onrender.com`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, JSX, Vanilla CSS Enterprise Theme, Lucide Icons, Vite.
- **Backend**: Spring Boot 3.2.5, Java 21, Spring Data JPA, Spring Security 6, JJWT 0.12.5.
- **Database**: Relational schema (`users`, `students`, `fee_structures`, `student_fee_records`, `payments`, `receipts`) running in MySQL / H2 mode.
