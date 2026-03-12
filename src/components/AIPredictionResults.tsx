import React from 'react';
import { AIPredictionResult } from '../types';
import { motion } from 'motion/react';
import { Flame, Trophy, Swords, TrendingUp, Crosshair, Target, CheckCircle2, Activity, AlertTriangle, Skull } from 'lucide-react';

interface Props {
  result: AIPredictionResult;
}

const TeamLogo = ({ name }: { name: string }) => (
  <img 
    src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}&backgroundColor=18181b&textColor=a855f7`} 
    alt={name} 
    className="w-8 h-8 rounded-full border-2 border-purple-500/30 shadow-lg"
  />
);

export default function AIPredictionResults({ result }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-8"
    >
      {/* Combo Bet Section - Premium Slip */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-500/40 p-6 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
        <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
          <Trophy size={120} className="text-emerald-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <Flame size={24} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-400 uppercase tracking-widest">
                Combiné VIP
              </h3>
              <p className="text-xs text-emerald-500/70 font-bold">Assurance Haute Probabilité</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-5">
            {result.combo.selections.map((sel, idx) => (
              <div key={idx} className="flex items-center justify-between bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/50 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <TeamLogo name={sel.homeTeam} />
                    <TeamLogo name={sel.awayTeam} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-200">
                      {sel.homeTeam}
                    </span>
                    <span className="text-xs font-bold text-zinc-400">
                      {sel.awayTeam}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-black text-white bg-gradient-to-r from-purple-600 to-emerald-600 px-3 py-1 rounded-md shadow-md">
                    {sel.prediction}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={10} /> {sel.confidence}% Sûr
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl">
            <p className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
              <Target className="text-emerald-400 shrink-0 mt-0.5" size={16} />
              <span><strong className="text-emerald-400">Analyse IA :</strong> {result.combo.analysis}</span>
            </p>
          </div>
        </div>
      </div>

      {/* All Matches - Card Layout for better readability */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Activity size={18} className="text-purple-400" />
          <h4 className="text-sm font-black text-zinc-200 uppercase tracking-widest">Prédictions Détaillées</h4>
        </div>
        
        <div className="grid gap-4">
          {result.matches.map((match, idx) => (
            <div key={idx} className="bg-zinc-900 border border-purple-500/20 rounded-2xl p-5 shadow-lg hover:border-purple-500/40 transition-all">
              {/* Teams Header */}
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-3 w-2/5">
                  <TeamLogo name={match.homeTeam} />
                  <span className="font-bold text-sm text-zinc-100 truncate">{match.homeTeam}</span>
                </div>
                <div className="flex flex-col items-center justify-center w-1/5">
                  <Swords size={20} className="text-zinc-600 mb-1" />
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">VS</span>
                </div>
                <div className="flex items-center justify-end gap-3 w-2/5">
                  <span className="font-bold text-sm text-zinc-100 truncate text-right">{match.awayTeam}</span>
                  <TeamLogo name={match.awayTeam} />
                </div>
              </div>

              {/* RNG Scenario Decoder */}
              <div className="mb-5 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <div className="flex items-center gap-2 mb-1.5">
                  {match.rngScenario.type === 'Logique' && <CheckCircle2 size={14} className="text-emerald-400" />}
                  {match.rngScenario.type === 'Surprise' && <AlertTriangle size={14} className="text-amber-400" />}
                  {match.rngScenario.type === 'Piège' && <Skull size={14} className="text-red-400" />}
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Décodage RNG : <span className={
                      match.rngScenario.type === 'Logique' ? 'text-emerald-400' :
                      match.rngScenario.type === 'Surprise' ? 'text-amber-400' : 'text-red-400'
                    }>{match.rngScenario.type}</span>
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{match.rngScenario.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* 1X2 Probabilities */}
                <div className="space-y-3">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-purple-400" /> 
                    Victoire (1X2)
                  </div>
                  <div className="flex justify-between items-center bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-zinc-500 font-bold mb-0.5">1</span>
                      <span className="text-sm font-black text-purple-400">{match.matchWinner.home}%</span>
                    </div>
                    <div className="w-px h-6 bg-zinc-800"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-zinc-500 font-bold mb-0.5">X</span>
                      <span className="text-sm font-black text-zinc-300">{match.matchWinner.draw}%</span>
                    </div>
                    <div className="w-px h-6 bg-zinc-800"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-zinc-500 font-bold mb-0.5">2</span>
                      <span className="text-sm font-black text-emerald-400">{match.matchWinner.away}%</span>
                    </div>
                  </div>
                </div>

                {/* Exact Scores */}
                <div className="space-y-3">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Crosshair size={14} className="text-emerald-400" /> 
                    Scores Exacts
                  </div>
                  <div className="flex flex-col gap-2">
                    {match.exactScores.slice(0, 2).map((score, sIdx) => (
                      <div key={sIdx} className="flex justify-between items-center bg-zinc-950/50 px-3 py-1.5 rounded-lg border border-zinc-800">
                        <span className="font-black text-sm text-zinc-200 tracking-wider">{score.score}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-400">{score.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Over 2.5:</span>
                    <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">{match.overUnder.over25}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">1er But:</span>
                    <span className="text-xs font-black text-zinc-300">{match.ftts}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1.5">
                    <Target size={12} className="text-blue-400" />
                    Total de Buts le plus Probable :
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-blue-400">{match.totalGoals.value}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                      Confiance : {match.totalGoals.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
