import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { useUploadFiles } from '../../hooks/useMarketplace';

interface ImageUploadZoneProps {
  onUploadSuccess: (paths: string[]) => void;
  maxFiles?: number;
  entityType?: 'book' | 'note';
  entityId?: string;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onUploadSuccess,
  maxFiles = 5,
  entityType,
  entityId,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);
  const { mutate: uploadFiles, isPending } = useUploadFiles();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    setErrorMsg(null);
    
    // Check limits keeping previous files in mind
    const fileLimit = maxFiles - previews.length;
    if (files.length > fileLimit) {
      setErrorMsg(`Puoi caricare al massimo altri ${fileLimit} file.`);
      return;
    }

    // Function to convert images to webp
    const convertToWebp = (file: File): Promise<File> => {
      return new Promise((resolve) => {
        if (!file.type.startsWith('image/') || file.type === 'image/webp' || file.type === 'image/gif') {
          return resolve(file);
        }
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            return resolve(file);
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) return resolve(file);
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          }, 'image/webp', 0.85); 
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
        };
        img.src = objectUrl;
      });
    };

    // Convert files
    const processedFiles = await Promise.all(files.map(convertToWebp));

    // Generate previews
    const newPreviews = processedFiles.map(file => ({
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : 'https://placehold.co/400x400/1f2937/94a3b8?text=Documento',
      name: file.name
    }));
    
    setPreviews(prev => [...prev, ...newPreviews]);

    // Call API
    uploadFiles({ files: processedFiles, options: { entityType, entityId } }, {
      onSuccess: (res) => {
        if (res.success && res.data.file_paths) {
          onUploadSuccess(res.data.file_paths);
        }
      },
      onError: () => {
        setErrorMsg('Errore durante l\'upload dei file. Riprova.');
      }
    });
  };

  const removePreview = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 
          ${isDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 bg-gray-900 hover:bg-gray-800'}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          accept="*/*" // supporta immagini e documenti
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          disabled={isPending}
        />
        
        {isPending ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Caricamento in corso...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-800 rounded-full shadow-sm">
              <UploadCloud className="h-8 w-8 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300">
                Trascina qui le immagini o clicca per esplorare
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supportato: WEBP, PNG, JPG, PDF, ecc... (Max {maxFiles} file)
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-sm text-red-400 mt-2 font-medium">{errorMsg}</p>
      )}

      {previews.length > 0 && !isPending && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-700 aspect-square">
              <img src={preview.url} alt={preview.name} className="object-cover w-full h-full" />
              <button 
                type="button"
                onClick={() => removePreview(idx)}
                className="absolute top-2 right-2 p-1.5 bg-gray-900/90 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
