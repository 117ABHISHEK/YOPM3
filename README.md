# Cael & Selene - Luxury E-Commerce Website

This is a full-stack web application for a fictional luxury fashion brand, "Cael & Selene". The project features a complete customer-facing experience, from browsing products to placing an order, backed by a robust server-side application.

## ✨ Features

### Frontend (Client)
- **Elegant UI/UX**: A modern, responsive, and luxurious design built with Bootstrap 5.
- **Engaging Animations**: Smooth page load animations, scroll-based fade-in effects, and interactive hover states.
- **Product Catalog**: Separate, filterable collection pages for Men's and Women's fashion.
- **Product Filtering**: Users can filter products by category (e.g., T-Shirts, Dresses, Outerwear).
- **Interactive Modals**:
    - **Product Details**: View product information without leaving the page.
    - **Shopping Cart**: A persistent cart that stores items in `localStorage`.
    - **Checkout Flow**: A multi-step process to gather shipping information.
- **User Authentication**: Secure JWT-based registration and login system integrated into the checkout process.
- **Order History**: Logged-in users can view their past orders.

### Backend (Server)
- **RESTful API**: Built with Express.js to handle all business logic.
- **Database**: MongoDB with Mongoose for data modeling and persistence.
- **User Management**: Secure user registration with password hashing (`bcrypt`) and login.
- **Authentication**: JSON Web Tokens (JWT) are used to protect sensitive routes like checkout and order history.
- **Order Processing**: An endpoint to validate and save customer orders to the database.
- **Data Serving**: Endpoints to serve product information and user-specific order history.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3, JavaScript (ES6+)
*   **Frameworks/Libraries**: Bootstrap 5
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB, Mongoose
*   **Authentication**: JSON Web Tokens (JWT), bcrypt

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or later recommended)
-   MongoDB installed and running on its default port (27017).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd YOPM3
    ```

2.  **Install server dependencies:**
    Navigate to the server directory and install the required npm packages.
    ```bash
    cd server
    npm install
    ```

3.  **Configure Environment Variables:**
    In the `server/server.js` file, ensure the MongoDB connection string and JWT secret are set. For production, it is highly recommended to use environment variables.
    ```javascript
    // server/server.js
    const MONGO_URI = "mongodb://localhost:27017/Cael&Selene";
    const JWT_SECRET = "your_strong_jwt_secret_key";
    ```

4.  **Run the server:**
    ```bash
    node server.js
    ```
    The server will start on `http://localhost:3000`.

5.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`. The `index.html` file from the `client` directory will be served.
