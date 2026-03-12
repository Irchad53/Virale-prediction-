/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ImageUploadForm from './components/ImageUploadForm';
import AIPredictionResults from './components/AIPredictionResults';
import { predictFromImages } from './services/aiPredictor';
import { AIPredictionResult } from './types';
import { Shield, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [result, setResult] = useState<AIPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCodeInput === 'DOLLARS') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setAccessCodeInput('');
    }
  };

  // Compression d'image côté client pour accélérer l'envoi à l'IA
  const compressImage = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Réduction de la taille pour la vitesse
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compression JPEG à 70% pour un upload ultra-rapide
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          const base64 = dataUrl.split(',')[1];
          resolve({ base64, mimeType: 'image/jpeg' });
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handlePredict = async (img1: File, img2: File) => {
    setIsLoading(true);
    setLoadingMessage('Compression des images...');
    setError(null);
    try {
      // 1. Compression ultra-rapide
      const file1 = await compressImage(img1);
      const file2 = await compressImage(img2);
      
      setLoadingMessage('Lecture des données (OCR)...');
      
      // 2. Appel à l'IA optimisée
      const prediction = await predictFromImages(
        file1.base64, file1.mimeType,
        file2.base64, file2.mimeType,
        (msg) => setLoadingMessage(msg)
      );
      
      setLoadingMessage('Finalisation des statistiques...');
      setResult(prediction);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de l'analyse IA. Veuillez réessayer avec des images plus claires.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans text-zinc-100">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #a855f7, transparent 70%)' }}></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-500/30 flex items-center justify-center mx-auto mb-6 shadow-inner shadow-purple-500/20">
              <Shield className="text-purple-400" size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2">Accès Restreint</h1>
            <p className="text-zinc-400 text-sm mb-8">Veuillez entrer le code d'accès pour utiliser VirtualFoot<span className="text-emerald-400">AI</span>.</p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  placeholder="Code d'accès"
                  className={`w-full bg-zinc-950 border ${authError ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-purple-500'} rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white outline-none transition-colors`}
                  autoFocus
                />
                {authError && <p className="text-red-400 text-xs mt-2 font-medium">Code incorrect</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-purple-500/25"
              >
                Déverrouiller
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 pb-12 selection:bg-purple-500/30">
      <div className="bg-zinc-900 text-white pt-8 pb-16 px-4 rounded-b-[30px] shadow-2xl relative overflow-hidden border-b border-purple-500/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #a855f7, transparent 70%)' }}></div>
        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-inner shadow-purple-500/20">
              <Sparkles className="text-purple-400" size={20} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">VirtualFoot<span className="text-emerald-400">AI</span></h1>
          </div>
          <p className="text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Prédiction Pro & Combinés</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 -mt-10 relative z-20">
        <ImageUploadForm onPredict={handlePredict} isLoading={isLoading} loadingMessage={loadingMessage} />
        
        {error && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-400">
            <AlertCircle className="shrink-0 mt-0.5" size={14} />
            <p className="text-[10px] font-medium">{error}</p>
          </div>
        )}

        {result && !isLoading && (
          <AIPredictionResults result={result} />
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
            <Shield size={12} />
            <span>Propulsé par Google Gemini AI (Mode Rapide)</span>
          </div>
          <div className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 tracking-widest">
            Signature: Malawi (Jocker)
          </div>
        </div>
      </div>
    </div>
  );
}
