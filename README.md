# 🤍 YOPM3 — Cael & Selene | Luxury Fashion E-Commerce Website  
### *Year of Projects: Month 3 by @117ABHISHEK & @ShitalPanhalkar1015*

![YOPM3](https://img.shields.io/badge/Project-YOPM3-silver?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN%20%7C%20Luxury%20Brand-ivory?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

> ✨ **Cael & Selene** — a fictional **luxury fashion brand** crafted for the *Year of Projects: Month 3 (YOPM3)* challenge.  
> The project re-imagines what a premium online shopping experience feels like — sleek design, interactive animations, secure authentication, and an end-to-end order system.

---

## 🌟 About the Brand

**Cael & Selene** embodies elegance and modernity — where design meets technology.  
The platform offers a **seamless e-commerce experience**, mirroring real-world luxury brands with refined UI, product storytelling, and intuitive functionality.

---

## ✨ Features

### 🖥️ Frontend (Client)
- **Luxurious UI/UX:** Modern, responsive, and elegant visuals built with **Bootstrap 5**.  
- **Smooth Animations:** Scroll-based fade-ins and hover transitions for an upscale feel.  
- **Product Collections:** Distinct pages for **Men’s** and **Women’s** fashion lines.  
- **Smart Filtering:** Filter by categories such as *T-Shirts, Dresses, Outerwear,* etc.  
- **Interactive Modals:**  
  - 👗 **Product Details** – View details without leaving the page.  
  - 🛒 **Shopping Cart** – Persistent cart stored in `localStorage`.  
  - 💳 **Checkout Flow** – Multi-step shipping & confirmation process.  
- **User Authentication:** Secure **JWT-based** signup/login built into the checkout flow.  
- **Order History:** Logged-in users can revisit their previous orders anytime.

---

### ⚙️ Backend (Server)
- **Express API:** RESTful endpoints for all e-commerce operations.  
- **Database:** **MongoDB + Mongoose** powering all products, users, and orders.  
- **Authentication:** **JWT + bcrypt** for secure sessions.  
- **Order Processing:** Validates and stores customer orders seamlessly.  
- **Product Data:** Delivers curated fashion data via secure API routes.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)  
- MongoDB (running on `localhost:27017`)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/117ABHISHEK/YOPM3.git
cd YOPM3
```

#### 1️⃣ Install Dependencies
```bash
cd server
npm install
```

#### 2️⃣ Configure Environment
In `server/server.js`, set your MongoDB URI and JWT secret:
```javascript
const MONGO_URI = "mongodb://localhost:27017/CaelAndSelene";
const JWT_SECRET = "your_strong_jwt_secret_key";
```

#### 3️⃣ Start the Server
```bash
node server.js
```
Server runs on **http://localhost:3000**

#### 4️⃣ View the App
Open **http://localhost:3000** in your browser to explore *Cael & Selene.*

---

## 🗂️ Project Structure

```
YOPM3/
├── client/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── server/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── controllers/
└── README.md
```

---

## 🔮 Future Enhancements
- 👑 Admin dashboard for managing inventory & orders  
- 💳 Payment gateway integration (Stripe / PayPal)  
- 📦 Live order tracking system  
- 🖼️ Advanced visuals & product carousel  
- ☁️ Deployment on Render / Vercel / Railway  

---

## 👑 Contributors

| Name | Role | GitHub |
|------|------|---------|
| **Abhishek Shankar Chaugule** | Full-Stack Developer | [@117ABHISHEK](https://github.com/117ABHISHEK) |
| **Shital** | Co-Developer & Frontend Partner | [@ShitalPanhalkar1015](https://github.com/ShitalPanhalkar1015) |

---

## 📜 License
This project is licensed under the **MIT License** — feel free to explore and enhance it.

---

> 💫 *Month 3 complete — where technology meets elegance.*  
> — *YOPM Series by @117ABHISHEK and @ShitalPanhalkar1015*
