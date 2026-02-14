
import React from 'react';

interface SettingsScreenProps {
  store: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ store }) => {
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "flextrack_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted">Manage your data and preferences</p>
      </header>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Exercises & Groups</h3>
          <div className="bg-card rounded-3xl overflow-hidden border border-white/5">
            <button className="w-full text-left px-6 py-5 flex justify-between items-center border-b border-white/5 hover:bg-white/5 transition-colors">
              <span className="font-medium">Manage Muscle Groups</span>
              <span className="text-muted text-xs">{store.muscleGroups.length} Active</span>
            </button>
            <button className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/5 transition-colors">
              <span className="font-medium">Manage Exercise Library</span>
              <span className="text-muted text-xs">{store.exercises.length} Total</span>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Units</h3>
          <div className="bg-card rounded-3xl p-2 border border-white/5 flex">
             <button className="flex-1 py-3 rounded-2xl bg-primary text-dark font-bold text-sm">Kilograms (kg)</button>
             <button className="flex-1 py-3 rounded-2xl text-muted font-bold text-sm">Pounds (lb)</button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Data Management</h3>
          <div className="bg-card rounded-3xl overflow-hidden border border-white/5">
            <button 
              onClick={exportData}
              className="w-full text-left px-6 py-5 flex justify-between items-center border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium">Export Data</span>
                <span className="text-[10px] text-muted">Backup to JSON file</span>
              </div>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </button>
            <button className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/5 transition-colors">
               <div className="flex flex-col">
                <span className="font-medium">Import Data</span>
                <span className="text-[10px] text-muted">Restore from backup</span>
              </div>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            </button>
          </div>
        </section>

        <button 
          onClick={() => {
            if(confirm('DANGER: This will delete all your workout history. Proceed?')) {
              localStorage.removeItem('flextrack_data');
              window.location.reload();
            }
          }}
          className="w-full py-5 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 font-bold hover:bg-red-500/20 transition-all mt-4"
        >
          Reset All Data
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-1">FlexTrack v1.0.0</p>
        <p className="text-muted text-[10px] italic">Built for performance.</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
