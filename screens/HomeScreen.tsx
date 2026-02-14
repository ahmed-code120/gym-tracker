
import React from 'react';
import { MuscleGroup, ViewType } from '../types';

interface HomeScreenProps {
  store: any;
  onStartWorkout: (mg: MuscleGroup) => void;
  onNavigate: (view: ViewType) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ store, onStartWorkout, onNavigate }) => {
  const lastSession = store.sessions[0];
  const daysOfTraining = store.sessions.length;
  
  // Calculate this week's activity
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekSessions = store.sessions.filter((s: any) => new Date(s.date) >= weekStart);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hello, Athlete</h1>
          <p className="text-muted">Ready for your next session?</p>
        </div>
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center overflow-hidden">
           <img src="https://picsum.photos/100/100" alt="profile" />
        </div>
      </header>

      {/* Week Progress */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">This week</h2>
        <div className="flex justify-between items-center bg-card p-5 rounded-3xl">
          <div className="flex flex-col items-center">
             <span className="text-2xl font-bold">{weekSessions.length}</span>
             <span className="text-xs text-muted">Sessions</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div className="flex flex-col items-center">
             <span className="text-2xl font-bold">{store.sessions.length > 0 ? store.sessions.reduce((acc: number, s: any) => acc + s.exercises.length, 0) : 0}</span>
             <span className="text-xs text-muted">Exercises</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div className="flex flex-col items-center">
             <span className="text-2xl font-bold">{daysOfTraining}</span>
             <span className="text-xs text-muted">Total Days</span>
          </div>
        </div>
      </div>

      {/* Last Session / Next Recommendation */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Recent</h2>
        {lastSession ? (
          <div className="bg-card p-5 rounded-3xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{store.getMuscleGroupName(lastSession.muscleGroupId)}</h3>
                <p className="text-xs text-muted">{new Date(lastSession.date).toLocaleDateString()}</p>
              </div>
              <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded-full font-bold uppercase">Completed</span>
            </div>
            <div className="flex gap-2">
              {lastSession.exercises.slice(0, 3).map((ex: any, i: number) => (
                <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-muted">
                  {store.getExerciseName(ex.exerciseId).split(' ')[0]}
                </span>
              ))}
              {lastSession.exercises.length > 3 && <span className="text-[10px] text-muted self-center">+{lastSession.exercises.length - 3}</span>}
            </div>
          </div>
        ) : (
          <div className="bg-card p-8 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
            <p className="text-muted text-sm italic">No workouts recorded yet.</p>
          </div>
        )}
      </div>

      {/* Muscle Group Selection */}
      <div className="mb-4 flex justify-between items-end">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Start New Workout</h2>
        <button onClick={() => onNavigate('settings')} className="text-xs text-primary font-medium">Add Group</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {store.muscleGroups.map((mg: MuscleGroup) => (
          <button
            key={mg.id}
            onClick={() => onStartWorkout(mg)}
            className="bg-card hover:bg-card-lighter transition-all p-5 rounded-3xl border border-white/5 flex flex-col items-start gap-3 group relative overflow-hidden"
          >
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="font-bold text-lg">{mg.name.charAt(0)}</span>
            </div>
            <span className="font-bold text-base">{mg.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
