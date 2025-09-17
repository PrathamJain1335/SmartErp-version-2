# 🎓 College ERP System

A comprehensive **Enterprise Resource Planning (ERP) System** designed specifically for educational institutions. Built with modern web technologies and featuring AI-powered tools for enhanced productivity.

## 🌟 Features

### 🔐 **Multi-Role Authentication**
- **Admin Portal**: Complete system management and analytics
- **Faculty Portal**: Course management, student tracking, and academic tools
- **Student Portal**: Academic dashboard, AI-powered portfolio generation

### 🎨 **Modern UI/UX**
- **Dark/Light Theme Toggle**: Seamless theme switching with persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation**: Sidebar with pin/unpin functionality
- **Real-time Notifications**: Live updates and alerts

### 🤖 **AI-Powered Features**
- **Universal Chatbot**: Context-aware AI assistant for all user roles
- **Portfolio Generator**: AI-powered student portfolio creation with multiple templates
- **Smart Responses**: Intelligent query handling and educational support

### 📊 **Dashboard Analytics**
- Role-specific dashboards with relevant metrics
- Real-time data visualization
- Performance tracking and reporting

## 🛠️ Technology Stack

### **Frontend**
- **React 18** with hooks and modern patterns
- **React Router** for navigation
- **Tailwind CSS** for styling with CSS variables
- **Vite** for fast development and building

### **Backend**
- **Node.js** with Express.js
- **RESTful API** architecture
- **JWT Authentication** with role-based access
- **CORS** enabled for cross-origin requests

### **AI Services**
- **Python FastAPI** for AI endpoints
- **Local AI Models** (no external API keys required)
- **Lightweight Implementation** for quick deployment

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **Python** 3.8+
- **npm** or **yarn**

### 1️⃣ Clone & Setup
```bash
# Clone the repository
git clone <repository-url>
cd College_ERP

# Install frontend dependencies
npm install

# Setup backend (if exists)
cd college-erp-backend
npm install

# Setup AI service (if exists)  
cd ai-service
pip install -r requirements.txt
cd ../..
```

### 2️⃣ Development Mode
```bash
# Start all services simultaneously
npm run start:dev

# Or start individually:
npm run dev              # Frontend only (port 5173)
cd college-erp-backend && node start.js  # Backend (port 5000)
cd ai-service && python start.py         # AI service (port 8001)
```

### 3️⃣ Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8001

## 🔑 Demo Credentials

| Role    | Email                                | Password |
|---------|--------------------------------------|---------|
| Admin   | admin@jecrc.ac.in                   | admin123 |
| Student | alice.johnson.cse25004@jecrc.edu    | demo123  |
| Faculty | jane.smith@jecrc.edu                | demo123  |

## 📁 Project Structure

```
College_ERP/
├── 📂 src/                          # React frontend source
│   ├── 📂 components/              # Reusable React components
│   │   ├── Login.jsx              # Authentication component
│   │   ├── UniversalChatbot.jsx   # AI chatbot component
│   │   └── Portfolio.jsx          # Portfolio generator
│   ├── 📂 services/               # API services
│   │   └── auth.js                # Authentication API
│   ├── 📂 portals/               # Role-specific portals
│   │   ├── Admin.jsx             # Admin dashboard
│   │   ├── Faculty.jsx           # Faculty dashboard
│   │   └── Student.jsx           # Student dashboard
│   └── App.jsx                   # Main app component
├── 📂 college-erp-backend/        # Node.js backend
│   ├── 📂 ai-service/            # Python AI microservice
│   └── start.js                  # Backend entry point
├── 📂 public/                    # Static assets
├── start-dev.js                  # Development startup script
├── build-prod.js                 # Production build script
└── package.json                  # Dependencies and scripts
```

## 🔧 Available Scripts

| Command | Description |
|---------|-----------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start:dev` | Start all services in development |
| `npm run start:prod` | Start production environment |
| `npm run build:prod` | Complete production build |
| `npm run test:system` | Build and test system |
| `npm run lint` | Lint code |
| `npm run preview` | Preview production build |

## 🎯 Key Features

### 🤖 AI Integration
- Universal chatbot across all portals
- AI-powered portfolio generation for students
- Local AI models (no API keys required)
- Context-aware responses

### 🎨 Theme System
- Dark/Light mode toggle
- Persistent theme preferences
- CSS variables for easy customization
- Consistent styling across components

### 🔒 Authentication
- Role-based access control
- JWT token management
- Session persistence
- Demo login support

## 🚀 Production Deployment

### Quick Production Start
```bash
npm run build:prod  # Build everything
npm run start:prod  # Start production services
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🐛 Troubleshooting

**Port Conflicts**: Check if ports 5173, 5000, 8001 are available
**Dependencies**: Ensure Node.js 16+ and Python 3.8+ are installed
**AI Service**: May take longer to start due to model loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Ready to transform educational management? 🚀**

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
