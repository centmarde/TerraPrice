# TerraPrice

<div align="center">

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge&logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

A modern web application for AI-powered residential floorplan cost estimation with admin review capabilities.

## 🏗️ Overview

TerraPrice is a comprehensive platform that allows users to submit residential floorplans and receive AI-powered cost estimates. The application features a complete admin dashboard for reviewing submissions, managing users, and approving cost estimates.

## ✨ Features

### User Features
- **Floorplan Submission**: Upload residential floorplan images
- **AI-Powered Cost Estimation**: Receive automated cost estimates
- **Real-time Status Tracking**: Monitor submission approval status
- **Responsive Design**: Optimized for desktop and mobile devices

### Admin Features
- **Admin Dashboard**: Comprehensive overview of all submissions
- **Review System**: Approve or reject floorplan submissions
- **User Management**: View and manage user accounts
- **Status Management**: Update submission statuses with admin notes
- **Settings Configuration**: Customize application settings

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **State Management**: Zustand
- **Form Handling**: React Hook Form with validation
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common layout components
│   ├── floorplan/      # Floorplan-specific components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── lib/                # External library configurations
├── pages/              # Page components
├── routes/             # Routing configuration
├── services/           # API services
├── stores/             # State management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/centmarde/TerraPrice.git
   cd TerraPrice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Database Setup

The application uses Supabase as the backend. Set up your Supabase project with the following tables:

- `floorplan_submissions`: Store floorplan submissions and cost estimates
- `admin_users`: Manage admin user accounts
- `user_info`: Store user details and contact information

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Components

### Authentication System
- Admin login and registration
- Protected routes for admin areas
- Persistent authentication state

### Floorplan Management
- Image upload and preview
- Status tracking (pending, approved, denied)
- Admin review and approval workflow

### Admin Dashboard
- Real-time submission overview
- User management interface
- Comprehensive review tools

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling with PostCSS configuration.

### ESLint
Code quality is maintained with ESLint configuration for React and TypeScript.

### Vite
Fast development and build process with Vite bundler.

## 🚢 Deployment

The application is configured for deployment on Vercel with proper SPA routing:

```bash
npm run build
```

The build artifacts will be generated in the `dist` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Workflow

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Consistent component structure
- Functional components with hooks

### State Management
- Zustand for global state
- React Hook Form for form state
- Context for authentication

### Component Architecture
- Reusable UI components
- Page-level components
- Service layer for API calls
- Custom hooks for business logic

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📚 Documentation

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development**: [centmarde](https://github.com/centmarde)

## 🐛 Issue Reporting

If you find any bugs or have feature requests, please create an issue on GitHub:
[Create an Issue](https://github.com/centmarde/TerraPrice/issues)

## 🚀 Future Enhancements

- [ ] Mobile app version
- [ ] Advanced AI cost estimation models
- [ ] Integration with construction databases
- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Multi-language support

---
