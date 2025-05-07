import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileAccepted: (file: File) => void;
  className?: string;
  accept?: Record<string, string[]>;
  disabled?: boolean;
}

export function FileUploader({ 
  onFileAccepted, 
  className,
  accept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/webp': ['.webp']
  },
  disabled = false
}: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    setError(null);
    onFileAccepted(file);
  }, [onFileAccepted]);
  
  const onDropRejected = useCallback(() => {
    setError("Please upload a valid image file (PNG, JPG, JPEG, WEBP).");
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    maxFiles: 1,
    disabled,
    maxSize: 10 * 1024 * 1024, // 10MB
  });
  
  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={cn(
          "drag-drop-area",
          isDragActive && "border-primary bg-primary/10",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input {...getInputProps()} />
        
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p className="text-center text-gray-300">
          Drag & drop your image,<br />
          or <span className="text-primary font-medium">browse your PC</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">Supports: PNG,JPG,JPEG,WEBP</p>
        
        {error && (
          <p className="mt-2 text-destructive text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
