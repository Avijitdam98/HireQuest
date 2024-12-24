import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">SkillMatch</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/jobs" className="transition-colors hover:text-foreground/80">Jobs</Link>
            <Link to="/teams" className="transition-colors hover:text-foreground/80">Teams</Link>
            <Link to="/chat" className="transition-colors hover:text-foreground/80">Chat</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
