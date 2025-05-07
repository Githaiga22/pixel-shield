import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function EditHistory() {
  const [match, params] = useRoute("/history/:id");
  const { toast } = useToast();
  const id = params?.id;
  
  const { data: result, isLoading, error } = useQuery({
    queryKey: [`/api/verifications/${id}/history`],
    enabled: !!id,
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load edit history. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  if (!match) return null;
  
  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading edit history...</p>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">History Not Found</h2>
            <p className="text-gray-400 mb-4">
              The edit history you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="w-full">Go Back Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex-grow flex flex-col p-4 max-w-7xl mx-auto w-full">
      <div className="bg-darkSecondary rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Image Edit History</h2>
          <button className="text-primary p-1 rounded hover:bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <img
              src={result.imageUrl}
              alt="Verified image"
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <p className="text-gray-400 mb-1">Image Name</p>
                <p className="text-white font-medium">{result.fileName}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Upload date</p>
                <p className="text-white font-medium">{new Date(result.uploadDate).toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1">Image hash</p>
                <p className="text-white font-medium truncate">{result.hash}</p>
              </div>
            </div>
            
            {result.isEdited && (
              <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edited
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-lg mb-4">Edit History</h3>
          
          {result.edits && result.edits.length > 0 ? (
            result.edits.map((edit, index) => (
              <div className="mb-4 last:mb-0" key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {edit.type === 'brightness' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                      </svg>
                    )}
                    <h4 className="font-medium">{edit.type.charAt(0).toUpperCase() + edit.type.slice(1)}</h4>
                  </div>
                  <div className="bg-gray-700 rounded-md px-2 py-1 text-xs font-medium">Edited</div>
                </div>
                
                <div className="ml-7 space-y-2">
                  {edit.changes.map((change, changeIndex) => (
                    <div className="flex items-center justify-between text-sm" key={changeIndex}>
                      <span className="text-gray-400">{change.level}% Level</span>
                      <span className="text-gray-500">{new Date(change.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center p-4">No edit history found.</p>
          )}
        </div>
        
        <div className="flex justify-between">
          <Link href={`/result/${id}`}>
            <Button className="bg-gray-700 hover:bg-gray-600" variant="secondary">
              Back to Results
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
