# CodeForge

CodeForge (formerly LeetCode Project) is a comprehensive platform for mastering algorithms and data structures. It provides a rich environment for coding practice, progress tracking, and interview preparation with premium features like video solutions and AI assistance.

## 🚀 Features

-   **Problem Solving**: Interactive code editor with support for multiple languages.
-   **User Authentication**: Secure signup/login with email and Google OAuth.
-   **Premium Subscription**: Unlock exclusive video solutions and editorials via Razorpay integration.
-   **AI Assistant**: strict context-aware AI chat for helping with logic and debugging (powered by Google Gemini).
-   **Progress Tracking**: User profile with solved problems, streaks, and submission history.
-   **Admin Panel**: specific role-based access to manage problems and upload video solutions.
-   **Responsive Design**: Modern UI built with Tailwind CSS, fully responsive across devices.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS, DaisyUI
-   **State Management**: Redux Toolkit
-   **Routing**: React Router DOM (v6)
-   **HTTP Client**: Axios

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose ODM)
-   **Caching**: Redis
-   **Authentication**: JWT (JSON Web Tokens), Google OAuth
-   **Storage**: Cloudinary (for images & videos)
-   **Payments**: Razorpay
-   **AI**: Google Generative AI (Gemini)

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Local or Atlas)
-   Redis Server

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CodeForge
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory with the following variables:
```env
PORT=3000
DB_CONNECT_STRING=your_mongodb_connection_string
JWT_KEY=your_jwt_secret_key
GEMINI_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REDDIS_HOST=your_redis_host
REDDIS_PASS=your_redis_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../vite-project
npm install
```

Create a `.env` file in the `vite-project` directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the development server:
```bash
npm run dev
```

## 🌐 Deployment

The project is configured for deployment on render.com using the `render.yaml` file in the `Backend` directory.
Ensure all environment variables are correctly set in your deployment platform dashboard.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
