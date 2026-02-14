
export interface MuscleGroup {
  id: string;
  name: string;
  icon?: string;
}

export interface Exercise {
  id: string;
  muscleGroupId: string;
  name: string;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  notes?: string;
  isCompleted: boolean;
}

export interface SessionExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  muscleGroupId: string;
  exercises: SessionExercise[];
  notes?: string;
}

export type ViewType = 'home' | 'workout' | 'history' | 'stats' | 'settings';
