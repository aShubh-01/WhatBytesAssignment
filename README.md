Here's a **README.md** file for your project:  

---

# Project Management Backend API  

This is a **Project Management Backend API**, built using **Express.js** and **PostgreSQL**, as an assignment for **WhatBytes**.  

It allows users to **perform CRUD operations** on:
- **Users**
- **Projects**
- **Tasks**  

## Tech Stack  
- **Express.js** - Backend framework  
- **PostgreSQL** - Database  
- **Prisma** - ORM for database interactions  
- **JWT** - Authentication  
- **Bcrypt** - Password hashing  
- **Nodemon** - Development utility  

---

## Getting Started  

### **1️ Clone the Repository**  
```bash
git clone aShubh-01/WhatBytesAssignment
cd /WhatBytesAssignment
```

### **2️ Install Dependencies & Build**  
```bash
npm run build
```

### **3️ Setup Environment Variables**  
Create a `.env` file in the root directory and add the following variables:  
```env
DATABASE_URL=your_database_url make sure its a postgres database
JWT_SECRET=your_secret_key
PORT=your_preferred_port
```

---

## Running the Project  

### **For Development**  
```bash
npm run dev
```

### **For Production**  
```bash
npm start
```

---

## Features  
✅ **User Authentication** (Register/Login with JWT, Update, Delete, List Users)  
✅ **Project Management** (Create, Update, Delete & List Projects)  
✅ **Task Management** (Create, Update, Delete & Assign Tasks to Users)  
✅ **Secure API** (Protected Routes using JWT & Sensitive Data safely encrytped)  

---