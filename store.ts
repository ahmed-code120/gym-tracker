
import { useState, useEffect, useCallback } from 'react';
import { WorkoutSession, MuscleGroup, Exercise, SessionExercise, WorkoutSet } from './types';
import { INITIAL_MUSCLE_GROUPS, INITIAL_EXERCISES } from './constants';

const STORAGE_KEY = 'flextrack_data';

interface AppData {
  sessions: WorkoutSession[];
  muscleGroups: MuscleGroup[];
  exercises: Exercise[];
}

export const useFlexStore = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      sessions: [],
      muscleGroups: INITIAL_MUSCLE_GROUPS,
      exercises: INITIAL_EXERCISES
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addSession = useCallback((session: WorkoutSession) => {
    setData(prev => ({
      ...prev,
      sessions: [session, ...prev.sessions]
    }));
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setData(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== sessionId)
    }));
  }, []);

  const getPreviousSession = useCallback((muscleGroupId: string) => {
    return data.sessions.find(s => s.muscleGroupId === muscleGroupId);
  }, [data.sessions]);

  const getExerciseName = useCallback((exerciseId: string) => {
    return data.exercises.find(e => e.id === exerciseId)?.name || 'Unknown Exercise';
  }, [data.exercises]);

  const getMuscleGroupName = useCallback((mgId: string) => {
    return data.muscleGroups.find(mg => mg.id === mgId)?.name || 'Unknown';
  }, [data.muscleGroups]);

  const getExerciseHistory = useCallback((exerciseId: string) => {
    const history: { date: string, maxWeight: number, volume: number }[] = [];
    data.sessions.forEach(session => {
      const ex = session.exercises.find(se => se.exerciseId === exerciseId);
      if (ex) {
        const maxWeight = Math.max(...ex.sets.map(s => s.weight), 0);
        const volume = ex.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
        history.push({ date: session.date, maxWeight, volume });
      }
    });
    return history.reverse();
  }, [data.sessions]);

  return {
    ...data,
    addSession,
    deleteSession,
    getPreviousSession,
    getExerciseName,
    getMuscleGroupName,
    getExerciseHistory
  };
};
