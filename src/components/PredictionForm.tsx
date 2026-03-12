import React, { useState } from 'react';
import { FormData } from '../types';
import { Filter, ChevronDown } from 'lucide-react';

const TEAMS = [
  { name: "A. Villa", league: "Virtual Premier", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=AV" },
  { name: "Bournemouth", league: "Virtual Premier", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=BO" },
  { name: "Brentford", league: "Virtual Premier", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=BR" },
  { name: "Brighton", league: "Virtual Premier", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=BHA" },
  { name: "Burnley", league: "Virtual Premier", form: "Poor", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=BU" },
  { name: "C. Palace", league: "Virtual Premier", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=CP" },
  { name: "Everton", league: "Virtual Premier", form: "Poor", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=EV" },
  { name: "Fulham", league: "Virtual Premier", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=FU" },
  { name: "Leeds", league: "Virtual Premier", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=LE" },
  { name: "Liverpool", league: "Virtual Premier", form: "Excellent", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=LIV" },
  { name: "London Blues", league: "Virtual Premier", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=LB" },
  { name: "London Reds", league: "Virtual Premier", form: "Excellent", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=LR" },
  { name: "Manchester Blue", league: "Virtual Premier", form: "Excellent", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=MB" },
  { name: "Manchester Red", league: "Virtual Premier", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=MR" },
  { name: "N. Forest", league: "Virtual Premier", form: "Poor", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=NF" },
  { name: "Newcastle", league: "Virtual Premier", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=NW" },
  { name: "Spurs", league: "Virtual Premier", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=SP" },
  { name: "Sunderland", league: "Virtual Premier", form: "Poor", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=SU" },
  { name: "West Ham", league: "Virtual Premier", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=WH" },
  { name: "Wolverhampton", league: "Virtual Premier", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=WO" },
  { name: "Madrid White", league: "Virtual Liga", form: "Excellent", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=MW" },
  { name: "Barcelona", league: "Virtual Liga", form: "Excellent", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=BA" },
  { name: "Atletico", league: "Virtual Liga", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=AT" },
  { name: "Sevilla", league: "Virtual Liga", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=SE" },
  { name: "Valencia", league: "Virtual Liga", form: "Poor", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=VA" },
  { name: "Milano Red", league: "Virtual Serie A", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=MIR" },
  { name: "Milano Blue", league: "Virtual Serie A", form: "Excellent", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=MIB" },
  { name: "Turin Zebra", league: "Virtual Serie A", form: "Good", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=TZ" },
  { name: "Rome Yellow", league: "Virtual Serie A", form: "Average", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=RY" },
  { name: "Napoli", league: "Virtual Serie A", form: "Poor", logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=NA" }
];

const LEAGUES = ["All", "Virtual Premier", "Virtual Liga", "Virtual Serie A"];
const FORMS = ["All", "Excellent", "Good", "Average", "Poor"];

interface Props {
  onPredict: (data: FormData) => void;
}

interface TeamSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: typeof TEAMS;
  label: string;
}

function TeamSelect({ value, onChange, options, label }: TeamSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.name === value);

  return (
    <div className="space-y-2 relative">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <img src={selected.logoUrl} alt={selected.name} className="w-6 h-6 rounded-full bg-white shadow-sm" />
            <span className="font-medium text-slate-700">{selected.name}</span>
          </div>
        ) : (
          <span className="text-slate-400">Aucune équipe</span>
        )}
        <ChevronDown size={16} className="text-slate-400" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-auto top-full left-0">
            {options.length > 0 ? options.map(option => (
              <button
                key={option.name}
                type="button"
                onClick={() => {
                  onChange(option.name);
                  setIsOpen(false);
                }}
                className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <img src={option.logoUrl} alt={option.name} className="w-6 h-6 rounded-full bg-white shadow-sm" />
                <span className="font-medium text-slate-700">{option.name}</span>
                <span className="text-[10px] text-slate-400 ml-auto uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">{option.form}</span>
              </button>
            )) : (
              <div className="p-4 text-center text-sm text-slate-500">Aucune équipe disponible</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function PredictionForm({ onPredict }: Props) {
  const [leagueFilter, setLeagueFilter] = useState<string>("All");
  const [formFilter, setFormFilter] = useState<string>("All");

  const filteredTeams = TEAMS.filter(t => 
    (leagueFilter === "All" || t.league === leagueFilter) &&
    (formFilter === "All" || t.form === formFilter)
  );

  const [formData, setFormData] = useState<FormData>({
    homeTeam: TEAMS[0].name,
    awayTeam: TEAMS[1].name,
    homeOdds: 1.5,
    drawOdds: 3.5,
    awayOdds: 5.0,
    homeRank: 1,
    awayRank: 20,
  });

  const handleFilterChange = (type: 'league' | 'form', value: string) => {
    const newLeague = type === 'league' ? value : leagueFilter;
    const newForm = type === 'form' ? value : formFilter;
    
    setLeagueFilter(newLeague);
    setFormFilter(newForm);

    const newFiltered = TEAMS.filter(t => 
      (newLeague === 'All' || t.league === newLeague) &&
      (newForm === 'All' || t.form === newForm)
    );

    if (newFiltered.length > 0) {
      setFormData(prev => {
        let nextHome = prev.homeTeam;
        let nextAway = prev.awayTeam;
        if (!newFiltered.find(t => t.name === nextHome)) nextHome = newFiltered[0].name;
        if (!newFiltered.find(t => t.name === nextAway)) nextAway = newFiltered[Math.min(1, newFiltered.length - 1)].name;
        return { ...prev, homeTeam: nextHome, awayTeam: nextAway };
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Odds') || name.includes('Rank') ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      
      {/* Filters Section */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs uppercase tracking-wider mb-2">
          <Filter size={14} />
          <span>Filtres d'équipes</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase">Ligue</label>
            <select 
              value={leagueFilter}
              onChange={(e) => handleFilterChange('league', e.target.value)}
              className="w-full p-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {LEAGUES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase">Forme</label>
            <select 
              value={formFilter}
              onChange={(e) => handleFilterChange('form', e.target.value)}
              className="w-full p-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {FORMS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TeamSelect 
          label="Équipe Domicile"
          value={formData.homeTeam}
          onChange={(val) => setFormData(prev => ({ ...prev, homeTeam: val }))}
          options={filteredTeams}
        />
        <TeamSelect 
          label="Équipe Extérieur"
          value={formData.awayTeam}
          onChange={(val) => setFormData(prev => ({ ...prev, awayTeam: val }))}
          options={filteredTeams}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Classement Dom.</label>
          <input 
            type="number" 
            name="homeRank" 
            min="1" max="20" 
            value={formData.homeRank} 
            onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Classement Ext.</label>
          <input 
            type="number" 
            name="awayRank" 
            min="1" max="20" 
            value={formData.awayRank} 
            onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Cotes (1 X 2)</label>
        <div className="grid grid-cols-3 gap-3">
          <input 
            type="number" 
            step="0.01" 
            name="homeOdds" 
            value={formData.homeOdds} 
            onChange={handleChange}
            placeholder="1"
            className="w-full p-3 text-center font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
          <input 
            type="number" 
            step="0.01" 
            name="drawOdds" 
            value={formData.drawOdds} 
            onChange={handleChange}
            placeholder="X"
            className="w-full p-3 text-center font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
          <input 
            type="number" 
            step="0.01" 
            name="awayOdds" 
            value={formData.awayOdds} 
            onChange={handleChange}
            placeholder="2"
            className="w-full p-3 text-center font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={filteredTeams.length === 0}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
      >
        Générer la Prédiction (95% RNG)
      </button>
    </form>
  );
}
