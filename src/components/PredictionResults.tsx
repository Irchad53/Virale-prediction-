import React from 'react';
import { PredictionResult } from '../utils/predictor';
import { motion } from 'motion/react';
import { Target, Activity, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  result: PredictionResult;
  homeTeam: string;
  awayTeam: string;
}

export default function PredictionResults({ result, homeTeam, awayTeam }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-4"
    >
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
          <Target size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className="text-emerald-400" size={20} />
              Analyse RNG
            </h3>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
              {result.confidence}% Fiabilité
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Score Exact</p>
              <p className="text-4xl font-mono font-bold text-white tracking-tighter">{result.exactScore}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Total Buts</p>
              <p className="text-xl font-bold text-white mt-1">{result.totalGoals}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
              <Clock className="text-blue-400 shrink-0" size={18} />
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Mi-temps / Fin</p>
                <p className="font-bold text-sm truncate">{result.htFt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
              <CheckCircle2 className="text-purple-400 shrink-0" size={18} />
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">1er But (FTTS)</p>
                <p className="font-bold text-sm truncate">{result.ftts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert size={14} className="text-amber-500" />
          Scores Alternatifs
        </h4>
        <div className="flex gap-2">
          {result.alternativeScores.map((score, i) => (
            <div key={i} className="flex-1 bg-slate-50 border border-slate-200 py-3 text-center rounded-xl font-mono text-sm font-bold text-slate-700">
              {score}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
