import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { ThemeToggle } from '../ui/ThemeToggle';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';

const Navbar = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <nav className={`fixed top-0 w-full z-50 border-b ${
      isDarkMode 
        ? 'bg-[#282E33] border-[rgba(255,255,255,0.12)]' 
        : 'bg-white border-[#e0e0e0]'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-[#0A66C2]'
            }`}>
              SkillMatch
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/jobs" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isDarkMode 
                  ? 'text-[#B0B7BF] hover:text-white hover:bg-[#333B43]' 
                  : 'text-[#666666] hover:text-[#0A66C2] hover:bg-[#f3f2ef]'
              }`}
            >
              <WorkIcon sx={{ fontSize: '1.25rem' }} />
              <span className="text-sm font-medium">Jobs</span>
            </Link>
            <Link 
              to="/teams" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isDarkMode 
                  ? 'text-[#B0B7BF] hover:text-white hover:bg-[#333B43]' 
                  : 'text-[#666666] hover:text-[#0A66C2] hover:bg-[#f3f2ef]'
              }`}
            >
              <GroupsIcon sx={{ fontSize: '1.25rem' }} />
              <span className="text-sm font-medium">Teams</span>
            </Link>
            <Link 
              to="/chat" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isDarkMode 
                  ? 'text-[#B0B7BF] hover:text-white hover:bg-[#333B43]' 
                  : 'text-[#666666] hover:text-[#0A66C2] hover:bg-[#f3f2ef]'
              }`}
            >
              <ChatIcon sx={{ fontSize: '1.25rem' }} />
              <span className="text-sm font-medium">Chat</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            to="/login"
            className={`px-4 py-1.5 rounded-full border transition-colors ${
              isDarkMode 
                ? 'border-[#70B5F9] text-[#70B5F9] hover:bg-[#70B5F9]/10' 
                : 'border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/10'
            }`}
          >
            Sign in
          </Link>
          <Link 
            to="/signup"
            className={`px-4 py-1.5 rounded-full transition-colors ${
              isDarkMode 
                ? 'bg-[#70B5F9] text-[#1D2226] hover:bg-[#9CCCFA]' 
                : 'bg-[#0A66C2] text-white hover:bg-[#004182]'
            }`}
          >
            Join now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
