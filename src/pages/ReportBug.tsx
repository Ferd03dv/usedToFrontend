import React from 'react';
import { BugReporter } from '../components/dashboard/BugReporter';

export const ReportBug: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12 px-4">
      <BugReporter />
    </div>
  );
};
