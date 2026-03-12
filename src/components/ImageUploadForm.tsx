import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface Props {
  onPredict: (img1: File, img2: File) => void;
  isLoading: boolean;
  loadingMessage: string;
}

export default function ImageUploadForm({ onPredict, isLoading, loadingMessage }: Props) {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImg: (f: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image1 && image2) {
      onPredict(image1, image2);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-zinc-900 p-4 rounded-xl shadow-lg border border-purple-500/20">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 border border-dashed border-purple-500/30 rounded-lg bg-zinc-950/50 relative hover:bg-zinc-800 transition-colors">
          {image1 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="flex items-center justify-between w-full">
                <ImageIcon className="text-emerald-400" size={16} />
                <button type="button" onClick={() => setImage1(null)} className="p-1 hover:bg-zinc-700 rounded-full">
                  <X size={14} className="text-zinc-400" />
                </button>
              </div>
              <span className="text-[10px] font-medium text-zinc-300 truncate w-full text-center">{image1.name}</span>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer h-full py-2">
              <Upload className="text-purple-400 mb-1" size={18} />
              <span className="text-[10px] font-medium text-zinc-400 text-center">Cotes (1X2)</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setImage1)} />
            </label>
          )}
        </div>

        <div className="p-3 border border-dashed border-purple-500/30 rounded-lg bg-zinc-950/50 relative hover:bg-zinc-800 transition-colors">
          {image2 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="flex items-center justify-between w-full">
                <ImageIcon className="text-emerald-400" size={16} />
                <button type="button" onClick={() => setImage2(null)} className="p-1 hover:bg-zinc-700 rounded-full">
                  <X size={14} className="text-zinc-400" />
                </button>
              </div>
              <span className="text-[10px] font-medium text-zinc-300 truncate w-full text-center">{image2.name}</span>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer h-full py-2">
              <Upload className="text-purple-400 mb-1" size={18} />
              <span className="text-[10px] font-medium text-zinc-400 text-center">Classement</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setImage2)} />
            </label>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!image1 || !image2 || isLoading}
        className="w-full py-3 bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            {loadingMessage || "Analyse en cours..."}
          </>
        ) : (
          "Générer la Prédiction"
        )}
      </button>
    </form>
  );
}
