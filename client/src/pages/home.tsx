import { useState } from "react";
import { useLocation } from "wouter";
import { FileUploader } from "@/components/ui/file-uploader";
import { UploadProgress } from "@/components/upload-progress";
import { LoadingCircle } from "@/components/ui/loading-circle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useImageVerification } from "@/hooks/use-image-verification";

export default function Home() {
  const [location, setLocation] = useState("initial"); // initial, uploading, verifying
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const {
    uploadFile,
    verifyImage,
    uploadProgress,
    verificationProgress,
    selectedFile,
    verificationId,
    isUploading,
    isVerifying,
    uploadError,
    verificationError
  } = useImageVerification();
  
  const handleFileAccepted = async (file: File) => {
    setLocation("uploading");
    try {
      await uploadFile(file);
    } catch (error) {
      setLocation("initial");
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleVerifyImage = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first.",
        variant: "destructive"
      });
      return;
    }
    
    setLocation("verifying");
    try {
      await verifyImage();
      if (verificationId) {
        navigate(`/result/${verificationId}`);
      }
    } catch (error) {
      setLocation("uploading");
      toast({
        title: "Verification Failed",
        description: "There was an error verifying your image. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex-grow flex flex-col md:flex-row p-4 max-w-7xl mx-auto w-full">
      {/* Left Column - Upload Section */}
      <div className="w-full md:w-1/3 md:pr-4 mb-6 md:mb-0">
        <div className="bg-darkSecondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Upload Images</h2>
          
          <FileUploader 
            onFileAccepted={handleFileAccepted} 
            className="h-48 mb-4"
            disabled={isUploading || isVerifying}
          />
          
          {uploadError && (
            <div className="text-sm text-destructive mb-4">
              {uploadError}
            </div>
          )}
          
          {selectedFile && (
            <UploadProgress 
              file={selectedFile} 
              progress={uploadProgress}
              className="mb-4"
            />
          )}
          
          <Button 
            className="verify-button"
            disabled={!selectedFile || isUploading || isVerifying}
            onClick={handleVerifyImage}
          >
            Verify Image
          </Button>
        </div>
      </div>
      
      {/* Right Column - Verification Content */}
      <div className="w-full md:w-2/3 flex flex-col">
        {location === "initial" && (
          <div className="bg-darkSecondary rounded-lg p-6 flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-medium mb-4 text-center">Upload your image to start verification</h2>
            <p className="text-gray-400 text-center">
              Our ZK-powered verification helps identify AI-generated or manipulated images with precision
            </p>
          </div>
        )}
        
        {location === "uploading" && (
          <div className="bg-darkSecondary rounded-lg p-6 flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-medium mb-4 text-center">Ready to verify your image</h2>
            <p className="text-gray-300 mb-4">Click the Verify button to analyze your image</p>
            
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        
        {location === "verifying" && (
          <div className="bg-darkSecondary rounded-lg p-6 flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-medium mb-8 text-center">Generating ZK Proof</h2>
            
            <LoadingCircle progress={verificationProgress} />
            
            <p className="text-gray-300 mt-6">
              This would take approximately <span className="text-primary font-medium">30 seconds</span>
            </p>
            
            {verificationError && (
              <div className="mt-4 text-sm text-destructive">
                {verificationError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
