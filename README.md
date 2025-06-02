This project is divided into two parts:

* **Backend**: Express.js-based API with MongoDB.
* **Frontend**: Next.js-based React application.

## 📁 Directory Structure

```
/project-root
  ├── /backend
  └── /frontend
```

---

## 🚀 Setup Instructions

### 1️⃣ Prerequisites

Make sure you have the following installed:

* **Node.js** (version 16+ recommended)
* **npm** (comes with Node.js)
* **MongoDB** (for backend data storage)

---

## 📦 Backend Setup

### ➡️ Navigate to the backend directory:

```bash
cd backend
```

### ➡️ Install dependencies:

```bash
npm install
```

### ➡️ Setup environment variables:

Create a `.env` file in the `backend` directory with the following variables:

```
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

### ➡️ Run the server:

* For **development** (with hot-reloading):

```bash
npm run dev
```

* For **production**:

```bash
npm start
```

The backend should now be running on `http://localhost:5000` (or your specified port).

---

## 🌐 Frontend Setup

### ➡️ Navigate to the frontend directory:

```bash
cd frontend
```

### ➡️ Install dependencies:

```bash
npm install
```

### ➡️ Configure environment:

create a `.env.local` in the `frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### ➡️ Run the frontend:

* For **development**:

```bash
npm run dev
```

* For **production** (after build):

```bash
npm run build
npm run start
```

The frontend should now be accessible at `http://localhost:3000`.

---

## ✨ Author

Kushagra Agarwal

---
