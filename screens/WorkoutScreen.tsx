
import React, { useState, useEffect } from 'react';
import { MuscleGroup, WorkoutSession, SessionExercise, WorkoutSet, Exercise } from '../types';

interface WorkoutScreenProps {
  muscleGroup: MuscleGroup;
  store: any;
  onFinish: (session: WorkoutSession) => void;
  onCancel: () => void;
}

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ muscleGroup, store, onFinish, onCancel }) => {
  const [exercisesInSession, setExercisesInSession] = useState<SessionExercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const prevSession = store.getPreviousSession(muscleGroup.id);

  useEffect(() => {
    setAvailableExercises(store.exercises.filter((e: Exercise) => e.muscleGroupId === muscleGroup.id));
  }, [muscleGroup.id, store.exercises]);

  const addExerciseToWorkout = (exercise: Exercise) => {
    const newSessionEx: SessionExercise = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId: exercise.id,
      sets: [{ id: 's1', weight: 0, reps: 0, isCompleted: false }]
    };
    
    // Check for previous session data to help user
    const lastTime = prevSession?.exercises.find((se: any) => se.exerciseId === exercise.id);
    if (lastTime && lastTime.sets.length > 0) {
      newSessionEx.sets[0].weight = lastTime.sets[0].weight;
      newSessionEx.sets[0].reps = lastTime.sets[0].reps;
    }

    setExercisesInSession([...exercisesInSession, newSessionEx]);
    setShowAddModal(false);
  };

  const addSet = (exIdx: number) => {
    const newExs = [...exercisesInSession];
    const lastSet = newExs[exIdx].sets[newExs[exIdx].sets.length - 1];
    newExs[exIdx].sets.push({
      id: Math.random().toString(36).substr(2, 9),
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      isCompleted: false
    });
    setExercisesInSession(newExs);
  };

  const updateSet = (exIdx: number, setIdx: number, field: keyof WorkoutSet, value: any) => {
    const newExs = [...exercisesInSession];
    (newExs[exIdx].sets[setIdx] as any)[field] = value;
    setExercisesInSession(newExs);
  };

  const removeExercise = (exIdx: number) => {
    setExercisesInSession(exercisesInSession.filter((_, i) => i !== exIdx));
  };

  const handleFinish = () => {
    if (exercisesInSession.length === 0) return onCancel();
    
    const session: WorkoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      muscleGroupId: muscleGroup.id,
      exercises: exercisesInSession.filter(ex => ex.sets.length > 0)
    };
    onFinish(session);
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onCancel} className="text-muted hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-xl font-bold">{muscleGroup.name} Session</h2>
        <button onClick={handleFinish} className="bg-primary text-dark font-bold px-4 py-2 rounded-full text-sm">
          Finish
        </button>
      </div>

      <div className="space-y-6 pb-20">
        {exercisesInSession.map((se, exIdx) => {
          const lastTime = prevSession?.exercises.find((p: any) => p.exerciseId === se.exerciseId);
          
          return (
            <div key={se.id} className="bg-card rounded-3xl p-5 border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-primary">{store.getExerciseName(se.exerciseId)}</h3>
                <button onClick={() => removeExercise(exIdx)} className="text-muted hover:text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              {/* Set Headers */}
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-muted uppercase tracking-widest mb-2 px-2">
                <div className="col-span-1 text-center">SET</div>
                <div className="col-span-3 text-center">KG</div>
                <div className="col-span-3 text-center">REPS</div>
                <div className="col-span-5 text-center">PREV</div>
              </div>

              <div className="space-y-3">
                {se.sets.map((set, setIdx) => {
                  const prevSet = lastTime?.sets[setIdx];
                  return (
                    <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-1 text-center font-bold text-muted">{setIdx + 1}</div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value))}
                          placeholder="0"
                          className="w-full bg-dark border border-white/10 rounded-lg py-2 px-1 text-center text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={set.reps || ''}
                          onChange={(e) => updateSet(exIdx, setIdx, 'reps', parseInt(e.target.value))}
                          placeholder="0"
                          className="w-full bg-dark border border-white/10 rounded-lg py-2 px-1 text-center text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="col-span-5 flex items-center justify-center gap-2">
                        {prevSet ? (
                          <div className="text-[11px] text-muted bg-white/5 px-2 py-1 rounded-md">
                            {prevSet.weight}kg × {prevSet.reps}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted/50">—</span>
                        )}
                        <button 
                          onClick={() => updateSet(exIdx, setIdx, 'isCompleted', !set.isCompleted)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                            set.isCompleted ? 'bg-primary text-dark' : 'bg-white/5 text-muted border border-white/10'
                          }`}
                        >
                          {set.isCompleted && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => addSet(exIdx)}
                className="mt-4 w-full py-2 bg-white/5 rounded-xl text-xs font-bold text-muted hover:bg-white/10 transition-colors"
              >
                + ADD SET
              </button>
            </div>
          );
        })}

        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full py-5 bg-card border-2 border-dashed border-white/10 rounded-3xl text-primary font-bold hover:bg-white/5 transition-all"
        >
          + ADD EXERCISE
        </button>
      </div>

      {/* Add Exercise Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end">
          <div className="bg-card w-full max-w-lg mx-auto rounded-t-[3rem] p-8 pb-12 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold">Choose Exercise</h3>
               <button onClick={() => setShowAddModal(false)} className="text-muted">Close</button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {availableExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => addExerciseToWorkout(ex)}
                  className="w-full text-left p-5 bg-dark border border-white/5 rounded-2xl hover:border-primary/50 transition-colors flex justify-between items-center group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">{ex.name}</span>
                  <svg className="w-5 h-5 text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                </button>
              ))}
              {availableExercises.length === 0 && (
                <p className="text-center text-muted py-8">No exercises found for this group.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutScreen;
