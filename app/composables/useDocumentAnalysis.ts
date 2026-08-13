import type {
  SpreadsheetAnalysis,
  SpreadsheetInsights,
} from "~/types/document";

export const useDocumentAnalysis = () => {
  const api = useApi();

  const getAnalysis = (documentId: number) => {
    return api<SpreadsheetAnalysis>(`/documents/${documentId}/analysis`);
  };

  const getInsights = (documentId: number) => {
    return api<SpreadsheetInsights>(`/documents/${documentId}/insights`);
  };

  return {
    getAnalysis,
    getInsights,
  };
};
