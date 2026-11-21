# 🛒 ShopSphere — Smart E-Commerce & Business Analytics Platform

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/API-Express-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss)
![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-blue?style=for-the-badge&logo=cloudinary)

**Live Website:** https://shop-sphere-plum.vercel.app/

**Backend API:** https://shopsphere-r8uw.onrender.com/

**GitHub Repository:** https://github.com/Pushpendra51/ShopSphere

---

## 📌 Project Overview

ShopSphere is a full-stack e-commerce and business analytics platform developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The platform provides customers with a complete online shopping experience, including product discovery, authentication, cart and wishlist management, coupon application, checkout, order tracking, and product reviews.

It also provides an administrative dashboard for managing products, customer orders, users, inventory, and business information.

In addition to e-commerce functionality, ShopSphere includes a business analytics module that uses e-commerce datasets and data analysis techniques to generate meaningful business insights.

## 🎯 Project Objectives

- Develop a complete full-stack e-commerce application.
- Implement secure authentication using JWT and password hashing.
- Provide product, inventory, order, and user management.
- Integrate cloud-based product image uploads.
- Implement role-based access control for administrative functionality.
- Generate business insights through data analysis and visualization.
- Provide a responsive and user-friendly shopping experience.

---

## 🚀 Key Features

### 👤 1. Authentication and User Management

- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected routes.
- Role-based authorization.
- User profile management.
- Forgot password and password reset functionality.
- Last successful login tracking.

### 🛍️ 2. Product Management

- Browse available products.
- Search products.
- Filter products by category.
- View detailed product information.
- Display prices, discounts, stock, and ratings.
- Create new products through the admin panel.
- Edit existing product information.
- Update product stock.
- Delete products.
- Upload and replace product images using Cloudinary.

### 🛒 3. Shopping Cart

- Add products to the cart.
- Increase or decrease product quantities.
- Remove products.
- Calculate totals dynamically.
- Maintain user-specific cart information.

### ❤️ 4. Wishlist

- Add products to the wishlist.
- View saved products.
- Remove products from the wishlist.

### 💳 5. Checkout and Coupon Management

- Enter shipping information.
- Apply coupon codes.
- Validate discounts.
- Calculate the final order amount.
- Select an available payment method.
- Place orders.

### 📦 6. Order Management

- View order history.
- Track order status.
- View payment status.
- Manage customer orders through the admin dashboard.
- Update order status.

Order lifecycle:

`Pending → Processing → Shipped → Delivered`

### ⭐ 7. Product Review System

- Submit product ratings.
- Write product reviews.
- Display customer feedback.
- Maintain product rating information.

### 🛠️ 8. Admin Dashboard

The administrative dashboard provides centralized management of the e-commerce platform.

**Dashboard Overview**
- Total users.
- Total products.
- Total orders.
- Revenue information.
- Business performance information.

**Manage Products**
- Add products.
- Edit product details.
- Upload product images.
- Replace existing images.
- Manage inventory and stock.
- Delete products.

**Manage Orders**
- View customer orders.
- Update order status.
- Monitor payment information.

**Manage Users**
- View registered users.
- Search users by name, email, or phone.
- Filter users by role.
- View account creation information.
- View last successful login.
- Display user role information.

**Export Reports**
- Export sales report data in CSV format.

---

## 📊 Business Analytics Module

ShopSphere also includes a business analytics module designed to analyze e-commerce data and generate useful business insights.

### Dataset

The project uses the Brazilian E-Commerce Public Dataset by Olist.

The dataset contains information about:

- Customers.
- Orders.
- Order items.
- Payments.
- Product information.
- Sellers.
- Customer reviews.

### Analytics Performed

| Analysis | Purpose |
|---|---|
| Monthly Orders Trend | Understand order patterns over time |
| Payment Method Analysis | Analyze payment distribution |
| Top-Selling Products | Identify high-performing products |
| Customer Distribution | Analyze customer distribution by state |
| Review Analysis | Understand customer review patterns |

### Technologies Used

- Python
- Pandas
- Matplotlib

The analytics module processes dataset files and generates reports and visualizations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Image Storage | Cloudinary |
| Data Analysis | Python, Pandas, Matplotlib |
| Deployment | Vercel, Render |
| Version Control | Git, GitHub |

---

## 🏗️ Application Architecture

```text
                 CUSTOMER / ADMIN
                        |
                        v
              React.js Frontend
                   (Vercel)
                        |
                  REST API Calls
                        |
                        v
               Node.js + Express
                   (Render)
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
       MongoDB       Cloudinary    JWT Auth
       Atlas         Image Store   Security
          |
          v
    Application Data
          |
          v
    Business Analytics
     Python / Pandas
          |
          v
    Reports and Charts
```

---

## 📂 Project Structure

```text
ShopSphere/
│
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   ├── middleware/
│   │   └── uploadMiddleware.js
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── analytics/
│   ├── data/
│   ├── python/
│   └── excel-reports/
│
├── screenshots/
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm.
- MongoDB Atlas account or local MongoDB installation.
- Cloudinary account for image uploads.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/Pushpendra51/ShopSphere.git

cd ShopSphere
```

### 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Add your actual credentials locally. Never upload the `.env` file to GitHub.

Start the backend:

```bash
npm run dev
```

Backend URL:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

`http://localhost:5173`

The frontend communicates with the backend through the configured API URL or Vite development proxy.

### 4. Analytics Setup

Navigate to the analytics Python directory:

```bash
cd analytics/python
```

Install the required libraries:

```bash
pip install pandas matplotlib
```

Run the analysis script:

```bash
python ecommerce_analysis.py
```

---

## 🔐 Security and Access Control

ShopSphere uses several security mechanisms:

- JWT-based authentication.
- bcrypt password hashing.
- Protected frontend routes.
- Backend authentication middleware.
- Role-based authorization.
- Admin-only user management endpoints.
- Restricted product and order management operations.

New registrations receive the customer role by default. Administrative roles should only be assigned to trusted accounts through database administration.

---

## 🌐 Deployment

ShopSphere is deployed using cloud hosting services.

| Component | Platform |
|---|---|
| React Frontend | Vercel |
| Node.js Backend | Render |
| Database | MongoDB Atlas |
| Product Images | Cloudinary |
| Source Code | GitHub |

**Live Application:** https://shop-sphere-plum.vercel.app/

**Backend:** https://shopsphere-r8uw.onrender.com/

The frontend communicates with the deployed backend through the `VITE_API_URL` environment variable.

Example:

```env
VITE_API_URL=https://shopsphere-r8uw.onrender.com/api
```

Backend environment variables and credentials must be configured in the Render dashboard.

---

## 📡 API Overview

All backend API routes use the `/api` prefix.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Request password reset |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/profile` | Get user profile |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get products |
| GET | `/api/products/categories` | Get product categories |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/products/:id/review` | Submit product review |

Product creation and updates support image uploads through the backend upload middleware and Cloudinary.

### Cart

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/cart` | Add cart item |
| GET | `/api/cart` | Get cart |
| PUT | `/api/cart` | Update cart |
| DELETE | `/api/cart/:productId` | Remove cart item |

### Wishlist

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/wishlist` | Add wishlist item |
| GET | `/api/wishlist` | Get wishlist |
| DELETE | `/api/wishlist/:productId` | Remove wishlist item |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/admin` | Get all orders |
| PUT | `/api/orders/:id/status` | Update order status |

### Coupons

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/coupons/validate` | Validate coupon |

### Admin User Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Retrieve registered users |

The user management endpoint requires an authenticated administrator.

---

## 📸 Application Screenshots

Application screenshots are available in the `screenshots/` directory.

You can add or update the Markdown image references here using the actual filenames in that folder.

Recommended screenshots:

- Home page.
- Product listing.
- Product details.
- Shopping cart and checkout.
- Customer profile and wishlist.
- Admin dashboard.
- Manage Products.
- Manage Users.
- Manage Orders.

---

## 🎓 Learning Outcomes

Through this project, the following concepts were implemented:

- Full-stack web application development.
- REST API development.
- MongoDB database integration.
- Authentication and authorization.
- CRUD operations.
- Cloud-based image storage.
- Frontend and backend integration.
- Data analysis and visualization.
- Application deployment.
- Version control using Git and GitHub.

---

## 👨‍💻 Author

**Pushpendra**

B.Tech – Computer Science and Engineering

Lovely Professional University

GitHub: https://github.com/Pushpendra51

Portfolio: https://pushpendraportfolio.vercel.app/

---

## 📄 License

This project is developed for educational and portfolio purposes.
