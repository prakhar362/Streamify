# Streamify

**Streamify** is a real-time **chat messaging** and **video calling** platform tailored for **social peer learning**, **language exchange**, and **community building**. Users can chat, call, and collaborate in public or private groups with a clean, modern interface.

---

## 📸 Preview
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/56feec97-b8c2-4bd3-b640-6c29eff204cb" />


### 🖥️ Chat Interface  
 <img width="1499" height="728" alt="image" src="https://github.com/user-attachments/assets/a600b93a-f908-419b-95ef-436fa043b573" />


### 🎥 Video Call Screen  
<img width="565" height="544" alt="image" src="https://github.com/user-attachments/assets/d338a3c5-3b11-42b0-aace-109ba60e6b64" />


### 👥 Group Listing Page  
<img width="1659" height="783" alt="image" src="https://github.com/user-attachments/assets/bb0b82eb-e029-45f1-b5d9-4e25f2d0e0f1" />


---

## 🔥 Features

- ✅ Secure Authentication (JWT via HTTP-only cookies)
- 💬 1-on-1 & Group Messaging with **Stream Chat**
- 📞 Video Calls using **Stream Video SDK**
- 📁 Group Creation and Join Requests
- 🧭 Onboarding flow for new users
- 🔄 Real-time messaging & calls
- 🎨 Light/Dark theme toggle
- 📱 Fully responsive on mobile & desktop

---

## 🛠 Tech Stack

### Frontend (`frontend/`)
- React.js, React Router
- Tailwind CSS, DaisyUI
- React Query
- Stream Chat & Video SDK
- Vite, Toast Notifications

### Backend (`backend/`)
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Auth (via cookies)
- CORS, Cookie-parser
- RESTful APIs

---

## 🗂 Folder Structure
streamify/
├── frontend/ # React client
│ ├── src/
│ ├── public/
│ └── ...
├── backend/ # Express server
│ ├── controllers/
│ ├── models/
│ ├── middleware/
│ ├── routes/
│ └── server.js
└── README.md


---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/streamify.git
cd streamify
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a .env file:
```bash
PORT=
MONGO_URI= 
JWT_SECRET_KEY= 
STEAM_API_KEY=
STEAM_API_SECRET=
```

Start backend server:
```bash
nodemon server.js
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

Start frontend portal:
```bash
npm run dev
```
### Deployment
Frontend: Vercel
Backend: Render

**Important Deployment Notes:**

Set CORS with credentials: true and correct origins

Use secure: true and sameSite: 'lax' in cookie options

Proxy or .env config for frontend API calls in production

### 🧠 Use Cases
Practice spoken languages with peer learners

Create/join discussion groups and schedule video calls

Build focused communities around learning or interests

Conduct group projects with real-time chat & calls

### 🤝 Contributing
Pull requests and feedback are welcome!
Want to improve UI, performance, or add features? Fork the repo and send a PR.

### 📬 Contact
📧 Email: prakharshri2005@gmail.com








