import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useImageVerification() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationId, setVerificationId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  
  const { toast } = useToast();
  
  const simulateProgress = useCallback((setter, complete) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        complete();
      }
      setter(progress);
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  const uploadFile = useCallback(async (file) => {
    setSelectedFile(file);
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("image", file);
      
      // Simulate progress
      const cleanupProgress = simulateProgress(setUploadProgress, () => {});
      
      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      cleanupProgress();
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }
      
      const data = await response.json();
      setIsUploading(false);
      
      return data;
    } catch (error) {
      setUploadError(error.message);
      setIsUploading(false);
      throw error;
    }
  }, [simulateProgress]);
  
  const verifyImage = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationProgress(0);
    
    try {
      // Simulate progress
      let verificationCompleted = false;
      const cleanupProgress = simulateProgress(setVerificationProgress, () => {
        verificationCompleted = true;
      });
      
      // Start verification
      const response = await apiRequest("POST", "/api/verify", {
        fileName: selectedFile.name,
      });
      
      // Wait for simulation to complete
      if (!verificationCompleted) {
        await new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (verificationCompleted) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
        });
      }
      
      cleanupProgress();
      setVerificationProgress(100);
      
      const data = await response.json();
      setVerificationId(data.id);
      setIsVerifying(false);
      
      return data;
    } catch (error) {
      setVerificationError(error.message);
      setIsVerifying(false);
      throw error;
    }
  }, [selectedFile, simulateProgress]);
  
  return {
    uploadFile,
    verifyImage,
    uploadProgress,
    verificationProgress,
    selectedFile,
    verificationId,
    isUploading,
    isVerifying,
    uploadError,
    verificationError,
  };
}
