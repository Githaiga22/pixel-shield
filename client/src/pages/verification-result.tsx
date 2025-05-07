import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function VerificationResult() {
  const [match, params] = useRoute("/result/:id");
  const { toast } = useToast();
  const id = params?.id;
  
  const { data: result, isLoading, error } = useQuery({
    queryKey: [`/api/verifications/${id}`],
    enabled: !!id,
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load verification result. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const handleDownloadCertificate = async () => {
    try {
      const res = await apiRequest("GET", `/api/verifications/${id}/certificate`, undefined);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `certificate-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (!match) return null;
  
  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading verification result...</p>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Verification Not Found</h2>
            <p className="text-gray-400 mb-4">
              The verification result you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="w-full">Go Back Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const isAuthentic = result.isAuthentic;
  
  return (
    <div className="flex-grow flex flex-col p-4 max-w-7xl mx-auto w-full">
      <div className="bg-darkSecondary rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Verification Result</h2>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
            </svg>
          </button>
        </div>
        
        <div className="rounded-lg overflow-hidden bg-gray-800 mb-6">
          <div className="relative">
            <img 
              src={result.imageUrl} 
              alt="Verified image" 
              className="w-full h-auto"
            />
            <button className="absolute top-3 right-3 bg-gray-800/80 p-2 rounded-md hover:bg-gray-700/80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            {isAuthentic ? (
              <div className="flex items-center mb-2">
                <div className="bg-authentic/20 rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-authentic" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-authentic font-medium">Authentic image</h3>
                  <p className="text-sm text-gray-400">No edits or modifications detected.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center mb-2">
                <div className="bg-aigenerated/20 rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-aigenerated" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-aigenerated font-medium">AI-generated</h3>
                  <p className="text-sm text-gray-400">Potential AI-Generated or manipulated image</p>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mt-4">
              {isAuthentic ? (
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90" 
                  onClick={handleDownloadCertificate}
                >
                  Download Certificate
                </Button>
              ) : (
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Report Suspicious Image
                </Button>
              )}
              
              <Button className="flex-1 bg-gray-700 hover:bg-gray-600" variant="secondary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Link href={`/history/${id}`}>
            <Button className="bg-gray-700 hover:bg-gray-600" variant="secondary">
              View Edit History
            </Button>
          </Link>
          
          <Button className="bg-primary hover:bg-primary/90">
            View on-chain Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}
