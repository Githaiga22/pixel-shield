import { cn } from "@/lib/utils";

interface UploadProgressProps {
  file: File | null;
  progress: number;
  className?: string;
}

export function UploadProgress({ file, progress, className }: UploadProgressProps) {
  if (!file) return null;
  
  const isComplete = progress === 100;
  
  const getPreviewUrl = () => {
    return URL.createObjectURL(file);
  };
  
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
        <img 
          src={getPreviewUrl()} 
          alt="Upload preview" 
          className="h-12 w-12 object-cover rounded" 
          onLoad={() => URL.revokeObjectURL(getPreviewUrl())}
        />
        
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">{file.name}</span>
            <span className="text-xs text-green-400">{isComplete ? 'Uploaded' : 'Uploading'}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
