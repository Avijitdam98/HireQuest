# HireQuest

An Advanced Job Portal Platform with Modern Features

## Overview

HireQuest is a cutting-edge job portal that connects employers and job seekers through an intuitive and feature-rich platform. Built with modern web technologies, it offers a seamless experience for job posting, application management, and candidate selection.

## Features

### For Employers
- Easy job posting with detailed information
- Advanced application management system
- Real-time application tracking
- CV management with secure storage
- Application status updates (Accept/Reject)

### For Job Seekers
- User-friendly job search interface
- Simple application process
- Secure CV uploads
- Application status tracking
- Profile management

## Tech Stack

### Frontend
- Framework: React.js with Vite
- UI Components: Material-UI (MUI)
- State Management: React Hooks
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Routing: React Router DOM

### Backend
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- File Storage: Supabase Storage
- Real-time Features: Supabase Realtime

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Avijitdam98/HireQuest.git
cd HireQuest
```

2. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Configure environment variables:

Create a `.env` file in the client directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development servers:

```bash
# Start client (in client directory)
npm run dev

# Start server (in server directory)
npm run dev
```

## Project Structure

```
HireQuest/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Third-party library configurations
│   └── public/           # Static assets
│
└── server/               # Backend server
    ├── src/
    │   ├── routes/      # API routes
    │   ├── middlewares/ # Custom middlewares
    │   └── utils/       # Utility functions
    └── database/        # Database migrations and seeds
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Avijit Dam - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/Avijitdam98/HireQuest](https://github.com/Avijitdam98/HireQuest)
