import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Find Your Perfect Match
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Connect with opportunities that match your skills and aspirations.
          Join SkillMatch today and discover your next career move.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
