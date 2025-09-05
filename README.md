# 🛒 E-Commerce Full-Stack Application

A modern e-commerce application that allows users to **add**, **view**, and **remove products** from their cart, proceed to checkout, **enter/edit delivery addresses**. Built for simplicity, responsiveness, and smooth user experience.

Built using **Next.js 15**, **React 19**, **MongoDB**, and **Prisma**, **Tailwind CSS 4** this app provides a reliable digital shopping experience.

---

## ✅ Features

- 🔐 **Secure Authentication** (JWT-based with cookies)  
- 🛍 **Add & View Products in Cart with filters**  
- ❌ **Remove Items from Cart**  
- ✏️ **Editable Shipping Address on Checkout**  
- 💰 **Total Items, Delivery Price & Final Price Display**  
- 📱 **Responsive and Clean UI**  

---

## 🧱 Tech Stack

| Frontend | Backend | Database | Other Tools |
|----------|---------|----------|-------------|
| Next.js(15)  | API Routes (Node.js) | MongoDB | Prisma ORM |
| React(19)    | Axios |            | react-hot-toast |
| Tailwind CSS(4) | Context API | | js-cookie |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ecommerce-fullstack.git
cd ecommerce-fullstack

```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment Variables
```bash
# Database
DATABASE_URL="your database URL"
JWT_SECRET="your jwt secret"
NEXT_PUBLIC_API_URL="your api url"
``` 
### 4. Setup the Database
```bash
npx prisma db push
npx prisma generate
```
### 5. Run the App
```bash
npm run dev
```

---
Made with ❤️ by Sabesh
