
import { MuscleGroup, Exercise } from './types';

export const INITIAL_MUSCLE_GROUPS: MuscleGroup[] = [
  { id: '1', name: 'Chest' },
  { id: '2', name: 'Back' },
  { id: '3', name: 'Legs' },
  { id: '4', name: 'Shoulders' },
  { id: '5', name: 'Arms' },
  { id: '6', name: 'Core' },
];

export const INITIAL_EXERCISES: Exercise[] = [
  { id: 'e1', muscleGroupId: '1', name: 'Bench Press' },
  { id: 'e2', muscleGroupId: '1', name: 'Incline Dumbbell Press' },
  { id: 'e3', muscleGroupId: '1', name: 'Cable Fly' },
  { id: 'e4', muscleGroupId: '2', name: 'Pull Ups' },
  { id: 'e5', muscleGroupId: '2', name: 'Bent Over Rows' },
  { id: 'e6', muscleGroupId: '2', name: 'Lat Pulldown' },
  { id: 'e7', muscleGroupId: '3', name: 'Squats' },
  { id: 'e8', muscleGroupId: '3', name: 'Leg Press' },
  { id: 'e9', muscleGroupId: '4', name: 'Overhead Press' },
  { id: 'e10', muscleGroupId: '5', name: 'Bicep Curls' },
  { id: 'e11', muscleGroupId: '5', name: 'Tricep Extensions' },
];
