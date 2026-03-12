export interface ScorePrediction {
  score: string;
  probability: number;
}

export interface MatchPrediction {
  homeTeam: string;
  awayTeam: string;
  matchWinner: { home: number; draw: number; away: number };
  overUnder: { over15: number; over25: number; over35: number };
  exactScores: ScorePrediction[];
  totalGoals: {
    value: string;
    confidence: number;
  };
  ftts: string;
  rngScenario: {
    type: "Logique" | "Surprise" | "Piège";
    description: string;
  };
}

export interface ComboBetMatch {
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
}

export interface AIPredictionResult {
  matches: MatchPrediction[];
  combo: {
    selections: ComboBetMatch[];
    analysis: string;
  };
}
