import { GoogleGenAI, Type } from "@google/genai";
import { AIPredictionResult } from "../types";

const HISTORICAL_DATA = `
Journée 17: Newcastle 2-0 London Blues (1.47/4.72/5.97), West Ham 0-1 C. Palace (2.40/3.44/2.84), Brentford 0-0 Manchester Red (1.86/4.02/3.66), Leeds 0-2 Brighton (5.87/4.90/1.46), Liverpool 3-2 A. Villa (1.30/5.51/9.17), London Reds 3-1 Everton (1.33/5.04/9.24), Bournemouth 1-3 Manchester Blue (5.14/3.72/1.68), N. Forest 1-1 Sunderland (1.70/3.98/4.51), Wolverhampton 5-0 Spurs (2.64/3.87/2.37), Fulham 5-1 Burnley (1.60/4.59/4.63)
Journée 18: Everton 3-1 Newcastle (1.71/3.98/4.45), C. Palace 1-2 N. Forest (1.65/4.73/4.14), Spurs 1-2 Bournemouth (1.47/4.66/6.15), London Reds 4-1 Brentford (1.82/3.75/4.12), London Blues 0-2 Fulham (3.32/3.21/2.23), Sunderland 1-2 Leeds (3.63/3.78/1.93), Brighton 2-1 Manchester Blue (5.37/4.26/1.56), Burnley 2-1 Liverpool (1.36/5.27/7.31), A. Villa 2-3 Wolverhampton (1.63/4.05/5.02)
Journée 19: Spurs 2-1 A. Villa (1.75/4.22/3.96), Bournemouth 1-1 Brighton (2.53/3.68/2.55), N. Forest 3-2 Manchester Red (2.05/3.44/3.56), Fulham 2-0 Everton (1.83/3.62/4.24), Newcastle 0-0 Brentford (1.50/4.44/6.02), Manchester Blue 3-0 Sunderland (1.18/7.51/12.14), Wolverhampton 1-1 Burnley (1.77/4.04/4.04), Liverpool 3-0 London Blues (1.36/5.18/7.73), West Ham 1-4 London Reds (6.33/4.37/1.49), Leeds 2-3 C. Palace (5.09/3.76/1.67)
Journée 20: London Reds 0-1 N. Forest (1.22/6.68/11.09), Sunderland 2-1 Brighton (7.83/5.40/1.34), Everton 0-1 Liverpool (3.71/3.61/1.95), Manchester Red 3-1 Leeds (1.38/4.54/8.60), London Blues 2-0 Wolverhampton (1.41/4.73/7.15), Newcastle 4-2 West Ham (1.31/5.57/8.57), Brentford 4-2 Fulham (1.99/3.98/3.27), A. Villa 1-1 Bournemouth (1.45/5.09/5.76), Burnley 0-2 Spurs (3.74/3.97/1.85), C. Palace 3-0 Manchester Blue (4.13/3.67/1.83)
`;

const TEAMS = [
  "Manchester Blue", "London Reds", "Brentford", "A. Villa", "Liverpool", 
  "London Blues", "Manchester Red", "Fulham", "N. Forest", "C. Palace", 
  "Newcastle", "Brighton", "Spurs", "Bournemouth", "West Ham", 
  "Everton", "Wolverhampton", "Sunderland", "Burnley", "Leeds"
];

export async function predictFromImages(
  image1Base64: string, 
  image1MimeType: string,
  image2Base64: string,
  image2MimeType: string,
  onStatusUpdate?: (status: string) => void
): Promise<AIPredictionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("Clé API Gemini invalide ou manquante. Veuillez vérifier vos paramètres.");
  }
  
  onStatusUpdate?.("Connexion aux serveurs Google...");
  
  const ai = new GoogleGenAI({ apiKey });

  onStatusUpdate?.("Analyse croisée (Historique + RNG)...");

  const prompt = `
    Tu es un expert en analyse de football virtuel et en algorithmes RNG.
    Voici les données historiques récentes du jeu pour t'aider à comprendre les tendances :
    ${HISTORICAL_DATA}

    Je te fournis deux captures d'écran :
    1. Les cotes des matchs en cours (1 X 2).
    2. Le classement (ENGLISH LEAGUE) avec les points (Pts) et l'historique de forme (Match state).

    INFO CRUCIALE POUR LA LECTURE (OCR) : 
    Voici la liste exacte des 20 équipes de cette ligue virtuelle. Utilise cette liste pour corriger toute erreur de lecture sur les images :
    ${TEAMS.join(", ")}.

    FORMAT DE L'IMAGE 1 (COTES) :
    Attention, le texte sur l'image des cotes est formaté d'une manière très spécifique. Les noms des équipes sont souvent répétés deux fois, suivis des 3 cotes (1, X, 2).
    Exemple de lecture :
    "Manchester Red
    Manchester Red
    Leeds
    Leeds
    1,36
    4,68
    9,01"
    Cela signifie : Match "Manchester Red vs Leeds". Cote 1 (Victoire Domicile) = 1.36, Cote X (Nul) = 4.68, Cote 2 (Victoire Extérieur) = 9.01.
    Utilise cette logique pour extraire correctement tous les matchs et leurs cotes.

    Analyse ces images pour extraire les matchs visibles.
    - Utilise l'image 2 (Classement) pour évaluer l'écart de points et la dynamique entre les équipes.
    - N'oublie pas que le RNG génère parfois des surprises (ex: le 1er qui perd contre le 10ème).
    
    REGLE CRUCIALE 1 : Tu dois OBLIGATOIREMENT donner les prédictions pour TOUS les matchs listés sur l'image des cotes. Ne saute aucun match.
    REGLE CRUCIALE 2 : Tes prédictions DOIVENT être générées UNIQUEMENT grâce à l'analyse croisée des anciens résultats (HISTORICAL_DATA) fournis ci-dessus et de ton intelligence artificielle. Ne donne jamais de prédictions au hasard.
    REGLE CRUCIALE 3 : Pour chaque match, tu dois "démasquer le RNG" du jeu. Indique si le résultat attendu est "Logique" (le favori gagne), une "Surprise" (match nul ou victoire de l'outsider), ou un "Piège" (les cotes incitent à parier sur une équipe mais le RNG va la faire perdre). Fournis une courte description expliquant ce comportement RNG.

    Pour CHAQUE match trouvé, génère une prédiction ultra-précise en tenant compte du RNG du jeu virtuel et de l'historique.
    Ensuite, choisis les 3 MEILLEURS pronostics (les plus sûrs) parmi tous ces matchs pour créer un ticket combiné (Assurance Haute Probabilité).
    
    Retourne les informations suivantes au format JSON :
    - matches: Un tableau contenant pour chaque match :
      - homeTeam: nom de l'équipe à domicile (doit faire partie de la liste)
      - awayTeam: nom de l'équipe à l'extérieur (doit faire partie de la liste)
      - matchWinner: Probabilités pour 1, X, 2 en pourcentage (home, draw, away).
      - overUnder: Probabilités en pourcentage pour Over 1.5, Over 2.5, et Over 3.5 (over15, over25, over35).
      - exactScores: Les 3 scores exacts les plus probables avec leur probabilité (score, probability).
      - totalGoals: Prédiction du total de buts. Doit contenir "value" (ex: "2") et "confidence" (ex: 85).
      - ftts: L'équipe qui marquera le premier but (First Team To Score), ou "Aucun".
      - rngScenario: Démasquage du RNG. Doit contenir "type" ("Logique", "Surprise", ou "Piège") et "description" (courte explication).
    - combo: Un objet contenant :
      - selections: Un tableau de EXACTEMENT 3 matchs choisis pour le combiné (homeTeam, awayTeam, prediction (ex: "1X", "Over 1.5"), confidence (ex: 95)).
      - analysis: Une brève analyse expliquant pourquoi ce combiné est le plus sûr, en précisant explicitement que c'est basé sur "l'analyse des anciens résultats + IA".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Utilisation du modèle Flash pour une vitesse maximale
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: image1Base64, mimeType: image1MimeType } },
          { inlineData: { data: image2Base64, mimeType: image2MimeType } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  homeTeam: { type: Type.STRING },
                  awayTeam: { type: Type.STRING },
                  matchWinner: {
                    type: Type.OBJECT,
                    properties: {
                      home: { type: Type.NUMBER },
                      draw: { type: Type.NUMBER },
                      away: { type: Type.NUMBER }
                    }
                  },
                  overUnder: {
                    type: Type.OBJECT,
                    properties: {
                      over15: { type: Type.NUMBER },
                      over25: { type: Type.NUMBER },
                      over35: { type: Type.NUMBER }
                    }
                  },
                  exactScores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        score: { type: Type.STRING },
                        probability: { type: Type.NUMBER }
                      }
                    }
                  },
                  totalGoals: {
                    type: Type.OBJECT,
                    properties: {
                      value: { type: Type.STRING },
                      confidence: { type: Type.NUMBER }
                    },
                    required: ["value", "confidence"]
                  },
                  ftts: { type: Type.STRING },
                  rngScenario: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["type", "description"]
                  }
                },
                required: ["homeTeam", "awayTeam", "matchWinner", "overUnder", "exactScores", "totalGoals", "ftts", "rngScenario"]
              }
            },
            combo: {
              type: Type.OBJECT,
              properties: {
                selections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      homeTeam: { type: Type.STRING },
                      awayTeam: { type: Type.STRING },
                      prediction: { type: Type.STRING },
                      confidence: { type: Type.NUMBER }
                    }
                  }
                },
                analysis: { type: Type.STRING }
              },
              required: ["selections", "analysis"]
            }
          },
          required: ["matches", "combo"]
        }
      }
    });

    onStatusUpdate?.("Décodage des probabilités...");

    const text = response.text;
    if (!text) throw new Error("L'IA n'a renvoyé aucune donnée. L'image était peut-être illisible.");
    
    try {
      return JSON.parse(text) as AIPredictionResult;
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", text);
      throw new Error("L'IA a mal formaté sa réponse. Veuillez relancer la prédiction.");
    }
  } catch (error: any) {
    console.error("Erreur API Gemini:", error);
    
    // Si c'est une erreur qu'on a nous-même lancée (comme le JSON parse ou le texte vide)
    if (error.message && !error.message.includes("fetch") && !error.message.includes("API key")) {
      throw error;
    }

    if (error.message?.includes("API key not valid") || error.status === 400) {
      throw new Error("La clé API Gemini est invalide. Veuillez vérifier vos paramètres (Settings).");
    }
    
    if (error.message?.includes("SAFETY")) {
      throw new Error("L'IA a bloqué la demande pour des raisons de sécurité (filtres anti-paris). Essayez de rogner l'image.");
    }

    throw new Error(`Erreur de connexion à l'IA (${error.message || "Inconnue"}). Veuillez réessayer.`);
  }
}
