# FoodiesWeb
# Foodies Web

A full-stack food ordering web app with authentication, cart system, admin dashboard, and Stripe payments.

---

## 🔹 Table of Contents

* [Demo](#demo)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

---

## 🔹 Demo

**Live Demo:** ['https://foodiesweb-frontend.onrender.com']



---

## 🔹 Features

* User authentication and registration
* Browse menu items and categories
* Add items to cart and place orders
* Admin dashboard for managing orders and menu
* Stripe integration for secure payments
* Responsive design for mobile and desktop

---

## 🔹 Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT
* **Payment:** Stripe
* **Deployment:** Render

---

## 🔹 Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/foodies-web.git
cd foodies-web
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file locally (do **not** commit it). Use `.env.example` as reference.

4. Add your environment variables locally (example values in `.env.example`).

---

## 🔹 Environment Variables

Create a `.env` file and add the following (replace placeholders with real values):

```env
# Backend
MONGO_URL=your_mongodb_url_here
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here

# Frontend
VITE_API_URL=your_backend_url_here
```

> ⚠ **Do not commit your `.env` file** to GitHub.

---

## 🔹 Usage

* Start the backend server:

```bash
npm run server
```

* Start the frontend:

```bash
npm run client
```

* Visit `http://localhost:3000` to view the app

---

## 🔹 Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements.

---

## 🔹 License

This project is licensed under the MIT License.

---


