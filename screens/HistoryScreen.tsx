
import React, { useState } from 'react';

interface HistoryScreenProps {
  store: any;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ store }) => {
  const [filter, setFilter] = useState('');
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const filteredSessions = store.sessions.filter((s: any) => {
    const mgName = store.getMuscleGroupName(s.muscleGroupId).toLowerCase();
    return mgName.includes(filter.toLowerCase());
  });

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-6">History</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by muscle group..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-card border border-white/5 rounded-2xl py-4 px-12 focus:outline-none focus:border-primary/50"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </header>

      <div className="space-y-4">
        {filteredSessions.map((session: any) => (
          <div 
            key={session.id} 
            onClick={() => setSelectedSession(session)}
            className="bg-card p-5 rounded-3xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
              <span className="text-[10px] text-muted">
                {new Date(session.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{store.getMuscleGroupName(session.muscleGroupId)}</h3>
                <p className="text-xs text-muted">{session.exercises.length} Exercises Performed</p>
              </div>
              <svg className="w-5 h-5 text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        ))}

        {filteredSessions.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p>No training history found.</p>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-[2.5rem] p-8 max-h-[85vh] flex flex-col relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedSession(null)}
              className="absolute top-6 right-6 text-muted hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <header className="mb-6">
              <h3 className="text-2xl font-bold">{store.getMuscleGroupName(selectedSession.muscleGroupId)}</h3>
              <p className="text-muted text-sm">{new Date(selectedSession.date).toLocaleString()}</p>
            </header>

            <div className="flex-grow overflow-y-auto space-y-6 pr-2">
              {selectedSession.exercises.map((se: any, i: number) => (
                <div key={i} className="bg-dark/50 p-4 rounded-2xl border border-white/5">
                  <h4 className="font-bold text-primary mb-3">{store.getExerciseName(se.exerciseId)}</h4>
                  <div className="space-y-1">
                    {se.sets.map((set: any, j: number) => (
                      <div key={j} className="flex justify-between items-center text-sm">
                        <span className="text-muted">Set {j + 1}</span>
                        <span className="font-mono font-bold">{set.weight}kg × {set.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <button 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this session?')) {
                    store.deleteSession(selectedSession.id);
                    setSelectedSession(null);
                  }
                }}
                className="py-4 border border-red-500/30 text-red-400 rounded-2xl font-bold text-sm hover:bg-red-500/10 transition-colors"
               >
                 Delete
               </button>
               <button 
                 onClick={() => setSelectedSession(null)}
                 className="py-4 bg-primary text-dark rounded-2xl font-bold text-sm"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;
