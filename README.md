Auralicious 🍔🍕
Taste the Aura!
Auralicious is a comprehensive, full-stack food delivery application designed to provide a seamless and engaging ordering experience. Built with the MERN stack and enhanced with modern UI libraries and AI-powered features, it bridges variables between craving and satisfaction.

🚀 Key Features
🤖 AI-Powered Concierge ("CraveKeeper"): Integrated with Google Gemini, our chatbot helps users decide what to eat based on their mood, weather, or specific cravings with intelligent, context-aware suggestions.
🛒 Seamless Ordering Experience: Intuitive menu browsing, real-time cart management, and a streamlined checkout process.
💳 Secure Payments: Robust payment integration using Stripe for secure and verified transactions.
🔐 User Authentication: Secure login and registration flows (including Google OAuth support) to manage user profiles and order history.
📦 Order Tracking: Real-time status updates for users to track their food journey from kitchen to doorstep.
📱 Responsive & Interactive UI: Built with React and Vite, featuring smooth scrolling (Lenis), dynamic animations (GSAP, AOS), and a modern aesthetic using Material UI and Tailwind CSS.
👨‍🍳 Admin Dashboard: A dedicated panel for restaurant managers to update the menu, manage stock, and oversee order statuses.
🛠️ Tech Stack
Frontend
Framework: React.js (Vite)
Styling: SCSS, Tailwind CSS, Material UI
Animations: GSAP, AOS (Animate on Scroll)
State Management: React Context API
Routing: React Router DOM
HTTP Client: Axios
Backend
Runtime: Node.js
Framework: Express.js
Database: MongoDB (with Mongoose)
Authentication: JSON Web Tokens (JWT), Bcrypt
Payments: Stripe API
AI Integration: Google Gemini API
File Storage: Multer
Admin Panel
Framework: React.js (Vite)
Notifications: React Toastify
📂 Project Structure
/frontend: The user-facing application for browsing and ordering food.
/backend: The server-side logic handling APIs, database connections, and authentication.
/admin: The interface for restaurant administrators to manage content.
⚙️ Installation & Setup
Clone the repository

git clone https://github.com/Prathamesh1828/Auralicious.git
cd Auralicious
Install Dependencies Auralicious consists of three separate parts. You need to install dependencies for each.

# Backend
cd backend
npm install
# Frontend
cd ../frontend
npm install
# Admin Panel
cd ../admin
npm install
Environment Configuration Create a .env file in the backend, frontend, and admin directories with the necessary API keys (MongoDB URI, Stripe Secret, Gemini API Key, etc.).

Run the Project Open three separate terminals and run the following commands:

# Terminal 1: Backend Server
cd backend
npm run server
# Terminal 2: Frontend Client
cd frontend
npm run dev
# Terminal 3: Admin Panel
cd admin
npm run dev
