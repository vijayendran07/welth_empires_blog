# Wealth Empires 🌐

A premium, state-of-the-art financial intelligence platform designed for high-net-worth individuals, corporate leaders, and investors. Wealth Empires provides actionable insights, strategic reports, and an expansive network of expert advisors.

## 🚀 Features

- **High-End Editorial UI:** A visually stunning, "borderless" and glassmorphic design that delivers a true premium terminal experience.
- **Secure Authentication & Roles:** Role-based access control separating regular readers from administrators and authors.
- **Dynamic Content Management:** Full administrative dashboard to draft, edit, categorize, and publish articles, including rich text and media.
- **Secure Report Access:** Gated PDF downloads restricted strictly to authenticated members.
- **Interactive Discussions:** Community comment sections with profile attributions.

## 💻 Tech Stack

### Frontend (Client)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (configured for a dark, elegant aesthetic with vibrant gradients)
- **Routing:** React Router DOM
- **State Management:** Zustand (`useAuthStore` for session persistence)
- **HTTP Client:** Axios (intercepted for secure JWT transmission)

### Backend (Server)
- **Runtime:** Node.js + Express
- **Database ORM:** Prisma
- **Database:** PostgreSQL (hosted on Supabase)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing
- **Architecture:** Modular, resource-based folder structure (Auth, Users, Articles, Categories, Analytics, etc.)

## 📂 Project Structure

```text
wealth_blog/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI (sections, cards, shared)
│   │   ├── pages/              # Public & Admin Views
│   │   ├── lib/                # Configurations (Axios)
│   │   └── store/              # Global State (Zustand)
│
├── server/                     # Backend API & Services
│   ├── src/
│   │   ├── modules/            # Resource endpoints (auth, articles, etc.)
│   │   ├── middleware/         # Security and Validation guards
│   │   └── utils/              # Database singletons and helpers
│   ├── prisma/                 # Schema definitions and migrations
│   └── public/                 # Static media uploads
```

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/) database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vijayendran07/welth_empires_blog.git
   cd welth_empires_blog
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[db]"
   PORT=5000
   JWT_SECRET="your_super_secret_key"
   ```
   Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Running Locally
To start the application, run both the frontend and backend servers simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
Navigate to `http://localhost:5173` to view the platform.

---
*Developed for the future of global wealth creation.*