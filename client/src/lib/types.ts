export interface VerificationResult {
  id: string;
  imageUrl: string;
  fileName: string;
  hash: string;
  uploadDate: string;
  isAuthentic: boolean;
  isEdited: boolean;
  aiConfidence?: number;
  blockchain?: {
    txHash: string;
    blockNumber: number;
  };
}

export interface EditHistory {
  imageUrl: string;
  fileName: string;
  hash: string;
  uploadDate: string;
  isEdited: boolean;
  edits: Edit[];
}

export interface Edit {
  type: string;
  changes: EditChange[];
}

export interface EditChange {
  level: number;
  date: string;
}

export interface VerificationResponse {
  id: string;
  status: 'completed' | 'failed';
  result?: {
    isAuthentic: boolean;
    confidence: number;
  };
  error?: string;
}
