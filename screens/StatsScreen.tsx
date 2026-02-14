
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsScreenProps {
  store: any;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ store }) => {
  // Aggregate data for volume trend
  const volumeData = useMemo(() => {
    return store.sessions.map((s: any) => {
      const volume = s.exercises.reduce((acc: number, ex: any) => {
        return acc + ex.sets.reduce((setAcc: number, set: any) => setAcc + (set.weight * set.reps), 0);
      }, 0);
      return {
        date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: volume
      };
    }).reverse();
  }, [store.sessions]);

  // Find PRs
  const pRs = useMemo(() => {
    const records: Record<string, number> = {};
    store.sessions.forEach((s: any) => {
      s.exercises.forEach((ex: any) => {
        const max = Math.max(...ex.sets.map((set: any) => set.weight), 0);
        if (!records[ex.exerciseId] || max > records[ex.exerciseId]) {
          records[ex.exerciseId] = max;
        }
      });
    });
    return Object.entries(records).map(([id, weight]) => ({
      name: store.getExerciseName(id),
      weight
    })).sort((a, b) => b.weight - a.weight);
  }, [store.sessions, store]);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Progress</h1>
        <p className="text-muted">Tracking your performance evolution</p>
      </header>

      {/* Volume Chart */}
      <div className="bg-card p-6 rounded-3xl border border-white/5 mb-8">
        <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-6">Volume Trend (kg)</h3>
        <div className="h-[250px] w-full">
          {volumeData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="date" stroke="#8E8E93" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#8E8E93" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: '1px solid #ffffff10', color: '#fff' }}
                  itemStyle={{ color: '#D4FF00' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#D4FF00" 
                  strokeWidth={4} 
                  dot={{ fill: '#D4FF00', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted text-sm text-center italic">
              <p>Log at least 2 sessions to see progress charts.</p>
            </div>
          )}
        </div>
      </div>

      {/* PRs */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Personal Records</h3>
        <div className="space-y-3">
          {pRs.slice(0, 5).map((pr, i) => (
            <div key={i} className="bg-card p-4 rounded-2xl flex justify-between items-center border border-white/5">
              <div>
                <h4 className="font-bold">{pr.name}</h4>
                <p className="text-[10px] text-muted uppercase tracking-widest">Max Weight</p>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-2xl font-bold text-primary">{pr.weight}</span>
                 <span className="text-xs text-muted font-bold">KG</span>
              </div>
            </div>
          ))}
          {pRs.length === 0 && <p className="text-center text-muted italic text-sm">No records logged yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
