# ProjectPilot 🚀

ProjectPilot is a modern, high-performance project management and task tracking application built with the MERN stack. Designed with a stunning "Deep Space" aesthetic, it offers real-time synchronization, comprehensive analytics, and seamless team collaboration tools in a single unified workspace.

![ProjectPilot Hero]

## ✨ Key Features

- **Kanban Task Board**: Intuitive drag-and-drop style organization. Organize tasks by `To Do`, `In Progress`, and `Done`.
- **Advanced Project Analytics**: Real-time insights into project health, total tasks, overdue tasks, and completion rates.
- **Role-Based Access Control**: Secure team management. Only project administrators can delete tasks, ensuring data integrity.
- **Real-Time Data Sync**: Powered by a highly optimized Redux polling mechanism, keeping all users in sync without the heavy overhead of WebSockets.
- **Premium "Deep Space" UI**: A dark-themed, glassmorphism-inspired user interface offering a stunning visual experience.

## 🛠️ Technology Stack

- **Frontend**: React (via Vite), Tailwind CSS, Redux Toolkit, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Architecture**: Monorepo deployed as a unified full-stack service.

## 📖 Application Flow & Architecture

ProjectPilot uses a highly decoupled component architecture. 
1. **Authentication**: Users can register and log in to receive an encrypted JWT which protects subsequent API calls.
2. **Projects**: A user can create a project, becoming its `Admin`. They can invite other members by email.
3. **Tasks**: Within a project, any member can create tasks, assign them, and move them between statuses. Admin privileges are strictly enforced on backend routes for actions like deleting tasks.
4. **State Management**: The React frontend uses Redux Toolkit to manage authentication state and project/task data, utilizing Optimistic UI Updates for lightning-fast responsiveness while background polling keeps data fresh.

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/
cd ProjectPilot-Project
```

### 2. Install dependencies
Because the project uses a streamlined monorepo structure, you can install both backend and frontend dependencies from the root directory:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the **`backend`** folder and add the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 4. Run the application
Start the backend API and the Vite frontend server concurrently:
```bash
# Terminal 1: Start the backend
cd backend
npm run dev

# Terminal 2: Start the frontend
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` to view the application!

---

## ☁️ Deployment (Railway)

ProjectPilot is optimized for easy, free-tier deployment on [Railway](https://railway.app/). 

1. Create a new project on Railway and select **Deploy from GitHub repo**.
2. Select your `ProjectPilot-Project` repository.
3. In the Railway dashboard, add your environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - **`NODE_ENV=production`** (Crucial: This tells the Node server to serve the built React files).
4. **That's it!** Railway will automatically detect the root `package.json`, install all dependencies, build the React frontend, and boot up the Express server handling both your API and static UI.

---
*Developed with focus on beautiful UI, responsive UX, and robust code architecture.*
