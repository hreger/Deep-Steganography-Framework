import React from 'react';

interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
  simulationNote?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ title, icon, description, children, simulationNote }) => {
  return (
    <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/80 rounded-lg p-4 shadow-md h-full flex flex-col transition-all duration-300 hover:border-teal-500/60 hover:shadow-2xl hover:shadow-teal-900/50">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="text-teal-400">{icon}</div>
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-slate-400 mb-4 flex-shrink-0">{description}</p>
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      {simulationNote && (
        <p className="text-xs text-slate-500 mt-3 text-center bg-slate-800/50 p-2 rounded-md italic">
          <strong>Simulation Note:</strong> {simulationNote}
        </p>
      )}
    </div>
  );
};