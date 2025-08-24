# 🚀 Prompt Builder - AI-Powered Prompt Generation Platform

A full-stack web application that allows users to build, manage, and execute AI prompts with Google OAuth authentication and personalized prompt generation.

## ✨ Features

- **🔐 Google OAuth Authentication** - Secure login and registration with Google
- **📝 Prompt Builder** - Interactive prompt creation with categories and styles
- **🤖 AI Integration** - Execute prompts with AI (OpenAI/Gemini integration ready)
- **📊 Dashboard** - View statistics, manage prompts, and track executions
- **📱 Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **🎯 Role-based Prompts** - Personalized prompts based on user roles
- **💾 Prompt Library** - Save, edit, and organize your prompts

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client
- **Google Identity Services** - OAuth integration

### Backend
- **Django 5.0** - Python web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure token-based auth
- **PostgreSQL** - Database (SQLite for development)
- **django-allauth** - Social authentication
- **django-cors-headers** - CORS handling

## 📁 Project Structure

```
prompt-builder/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── dashboard/   # User dashboard
│   │   │   └── builder/     # Prompt builder (to be created)
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (AuthContext)
│   │   ├── lib/            # API utilities and constants
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                 # Django application
│   ├── prompt_builder/      # Django project settings
│   ├── authentication/     # User management app
│   ├── prompts/            # Prompt management app
│   ├── requirements.txt
│   └── manage.py
│
└── README.md
```

## 🛠 Current Status

### ✅ Completed
- [x] **Project scaffolding** - Full structure created
- [x] **Backend setup** - Django apps, models, views, URLs
- [x] **Frontend setup** - Next.js pages, components, context
- [x] **Authentication system** - JWT implementation
- [x] **API endpoints** - All CRUD operations
- [x] **Type safety** - 0 TypeScript compilation errors
- [x] **Dependencies** - All packages installed

### 🔄 Next Steps
1. **Database setup** - Create migrations and apply them
2. **Environment configuration** - Set up .env files
3. **Prompt Builder page** - Main prompt creation interface
4. **OpenAI integration** - Configure API key and test execution
5. **Testing** - Start both servers and test functionality

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL (optional, SQLite works for development)
- Google Gemini API key (FREE from Google AI Studio)

### Backend Setup

1. **Configure Python environment** (already done)
   ```bash
   # Virtual environment is already configured at s:/TechMont/.venv/
   ```

2. **Install dependencies** (already done)
   ```bash
   cd backend
   S:/TechMont/.venv/Scripts/python.exe -m pip install -r requirements.txt
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your settings:
   # - SECRET_KEY
   # - GEMINI_API_KEY (get from https://aistudio.google.com/app/apikey)
   # - DATABASE_URL (optional)
   ```

4. **Run migrations** (✅ COMPLETED)
   ```bash
   # Already completed! Database tables created successfully
   S:/TechMont/.venv/Scripts/python.exe manage.py makemigrations authentication
   S:/TechMont/.venv/Scripts/python.exe manage.py makemigrations prompts
   S:/TechMont/.venv/Scripts/python.exe manage.py migrate
   ```

5. **Create superuser** (✅ COMPLETED)
   ```bash
   # Already completed! Superuser created: admin
   S:/TechMont/.venv/Scripts/python.exe manage.py createsuperuser
   ```

6. **Start server** (✅ RUNNING)
   ```bash
   # Server is currently running at http://127.0.0.1:8000/
   S:/TechMont/.venv/Scripts/python.exe manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies** (already done)
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Django Admin: http://localhost:8000/admin

## 🎯 Key Features Breakdown

### Authentication & User Management
- Custom user model with roles (student, educator, researcher, etc.)
- JWT tokens with refresh mechanism
- User preferences for default categories and styles
- Secure password handling

### Prompt System
- **Categories**: Each optimized for specific use cases
- **Styles**: Affect tone and format of responses
- **Templates**: Dynamic prompt generation based on user profile
- **Execution**: Real-time AI responses via OpenAI API
- **Management**: Full CRUD operations with user isolation

### UI/UX Design
- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design for all devices
- Interactive components with hover effects
- Loading states and error handling
- Toast notifications for user feedback

## 🔧 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3  # or PostgreSQL URL
OPENAI_API_KEY=your-openai-api-key
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/` - Update user profile
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Prompts
- `GET /api/prompts/` - List user prompts (paginated)
- `POST /api/prompts/` - Create new prompt
- `GET /api/prompts/{id}/` - Get specific prompt
- `PATCH /api/prompts/{id}/` - Update prompt
- `DELETE /api/prompts/{id}/` - Delete prompt
- `POST /api/prompts/execute/` - Execute prompt with AI
- `GET /api/prompts/dashboard-stats/` - Get user statistics

## 🚀 Deployment

### Frontend (Vercel)
- Push to GitHub
- Connect to Vercel
- Set environment variables
- Deploy automatically

### Backend (Render/Railway/DigitalOcean)
- Configure production settings
- Set up PostgreSQL database
- Deploy with gunicorn
- Configure environment variables

### Database (Supabase/Neon)
- Create PostgreSQL instance
- Update DATABASE_URL
- Run production migrations

## 🔍 Error Resolution


### Getting Google Gemini API Key (FREE)

1. **Visit Google AI Studio**: Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. **Sign in**: Use your Google account
3. **Create API Key**: Click "Create API Key" button
4. **Copy the key**: Save the generated API key
5. **Add to .env**: Paste the key in your `backend/.env` file:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

**Note**: Gemini API is completely FREE with generous quotas for development and testing!

### Known Issues
- ✅ **Migration conflicts resolved** - Database setup completed successfully
- ⚠️ **Gemini API key needed** - Required for AI prompt execution (FREE API)

## 🎨 UI Components

- **Landing Page**: Hero section, features grid, call-to-action
- **Authentication**: Login/register forms with validation
- **Dashboard**: Statistics cards, prompt list, management actions
- **Navigation**: Responsive header with user menu
- **Loading States**: Animated loading indicators
- **Error Handling**: Toast notifications and error states

## 🔐 Security Features

- JWT token authentication with refresh
- Password validation and hashing
- CORS configuration
- Input sanitization
- User data isolation
- Secure API endpoints
- Environment variable protection

---

**Status**: ✅ **Ready for Development Testing**

All TypeScript errors resolved. Ready to set up database, configure environment variables, and start both servers for full functionality testing.
