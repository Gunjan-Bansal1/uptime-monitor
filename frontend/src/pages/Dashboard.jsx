import React, { useState } from 'react';
import AddUrlForm from '../components/AddUrlForm';
import UrlTable from '../components/UrlTable';

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Uptime Monitor
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time status tracking for registered web targets.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <AddUrlForm onUrlAdded={handleUrlAdded} />
          </div>
          <div className="md:col-span-2">
            <UrlTable refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

