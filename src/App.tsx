import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TaskManager } from './components/TaskManager';
import { GoalBoard } from './components/GoalBoard';
import { WorkTracker } from './components/WorkTracker';
import { CalendarView } from './components/CalendarView';
import { DailyReflection } from './components/DailyReflection';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'goals' | 'work' | 'calendar' | 'reflection'>('dashboard');

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="min-h-screen">
          <Header activeView={activeView} setActiveView={setActiveView} />
          
          <main className="max-w-6xl mx-auto px-4 py-6">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'tasks' && <TaskManager />}
            {activeView === 'goals' && <GoalBoard />}
            {activeView === 'work' && <WorkTracker />}
            {activeView === 'calendar' && <CalendarView />}
            {activeView === 'reflection' && <DailyReflection />}
          </main>
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;