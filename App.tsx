
import React, { useState } from 'react';
import { ViewType, WorkoutSession, MuscleGroup } from './types';
import { useFlexStore } from './store';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import HistoryScreen from './screens/HistoryScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [activeWorkout, setActiveWorkout] = useState<{ muscleGroup: MuscleGroup } | null>(null);
  const store = useFlexStore();

  const handleStartWorkout = (mg: MuscleGroup) => {
    setActiveWorkout({ muscleGroup: mg });
    setCurrentView('workout');
  };

  const handleFinishWorkout = (session: WorkoutSession) => {
    store.addSession(session);
    setActiveWorkout(null);
    setCurrentView('home');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen store={store} onStartWorkout={handleStartWorkout} onNavigate={setCurrentView} />;
      case 'workout':
        if (!activeWorkout) return <HomeScreen store={store} onStartWorkout={handleStartWorkout} onNavigate={setCurrentView} />;
        return (
          <WorkoutScreen 
            muscleGroup={activeWorkout.muscleGroup} 
            store={store} 
            onFinish={handleFinishWorkout}
            onCancel={() => {
              setActiveWorkout(null);
              setCurrentView('home');
            }} 
          />
        );
      case 'history':
        return <HistoryScreen store={store} />;
      case 'stats':
        return <StatsScreen store={store} />;
      case 'settings':
        return <SettingsScreen store={store} />;
      default:
        return <HomeScreen store={store} onStartWorkout={handleStartWorkout} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-dark relative flex flex-col">
      <div className="flex-grow px-4 pt-8">
        {renderView()}
      </div>
      
      {currentView !== 'workout' && (
        <BottomNav activeView={currentView} onNavigate={setCurrentView} />
      )}
    </div>
  );
};

export default App;
