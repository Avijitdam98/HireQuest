import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const JobCard = ({ job, matchScore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-card rounded-lg shadow-sm border"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        {matchScore && (
          <div className="px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-primary">
              {Math.round(matchScore)}% Match
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {job.required_skills?.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-secondary rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <span>{job.location}</span>
            {job.salary_range && (
              <>
                <span className="mx-2">•</span>
                <span>{job.salary_range}</span>
              </>
            )}
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
