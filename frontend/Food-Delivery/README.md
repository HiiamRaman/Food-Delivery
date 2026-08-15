# 🍔 Food Delivery Application

A full-stack food delivery application built to simulate a modern online food ordering experience.

The project includes customer authentication, food discovery, cart management, online payments, order management, admin controls, and real-time delivery tracking.

> **Note:** This is a demo/portfolio project created for learning and showcasing full-stack development skills. Payments, orders, and delivery operations are for demonstration purposes.

---

## ✨ Features

### 👤 Customer

- User registration and login
- Email OTP verification
- Forgot and reset password
- Secure JWT authentication
- Browse available food
- Search and filter food
- Add and remove items from cart
- Manage item quantities
- Apply coupons
- Place orders
- Online payment flow
- Track order status
- Real-time delivery tracking
- Responsive user interface

### 🛠️ Admin

- Secure admin authentication
- View customer orders
- Manage order status
- Confirm and prepare orders
- Dispatch orders for delivery
- Monitor the order lifecycle

---

## 🚚 Order Flow

The application follows a complete food-delivery lifecycle:

`Order Placed → Confirmed → Preparing → Out for Delivery → Delivered`

Customers can follow the progress of their order and track delivery after dispatch.

---

## 🗺️ Real-Time Tracking

The project includes real-time delivery functionality using Socket.IO.

It supports:

- Order-specific tracking rooms
- Live rider location updates
- Interactive map
- Delivery status updates
- Estimated delivery information
- Delivered event handling

---

## 💳 Payment

The application integrates Stripe for demonstrating the online checkout and payment workflow.

> ⚠️ This is a demo project. Do not use real payment information when exploring a deployed demo.

---

## 🔐 Authentication

Authentication includes:

- Access tokens
- Refresh tokens
- HTTP-only refresh-token cookies
- Protected API routes
- Role-based authorization
- Admin-only routes
- Password hashing
- OTP verification

---

## 🧰 Tech Stack

### Frontend

- React
- React Router
- Context API
- Axios
- Tailwind CSS
- Lucide React
- React Toastify
- Leaflet

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- Multer
- Cloudinary

### Payments

- Stripe

---

## 🏗️ Project Structure

The project separates the application into:

- **Customer Application**
- **Admin Dashboard**
- **Backend API**

This keeps customer functionality, administrative operations, and backend business logic separated and easier to maintain.

---

## 🎯 Purpose of the Project

This project was built to strengthen and demonstrate practical full-stack development skills rather than only creating a static UI.

Some of the main concepts explored include:

- REST API development
- Authentication and authorization
- Database modeling
- Cart state management
- Payment integration
- File and image uploads
- Protected routes
- Role-based access
- Real-time communication
- Order lifecycle management
- Live location tracking
- Responsive frontend development

---

## 🚧 Project Status

The application is actively being improved.

Planned improvements include:

- Demo user login
- Improved food search and filtering
- Favorites
- User profile
- Order history
- Better loading skeletons
- Improved empty states
- Enhanced order progress UI
- Mobile UI improvements

---

## ⚠️ Disclaimer

This application is a portfolio and educational project.

It is not a production food-delivery service. Restaurant data, orders, delivery tracking, payment flows, and other functionality may use test or demonstration data.

---

## 👨‍💻 Developer

Built by **Raman**

Created as part of my full-stack software development journey.
