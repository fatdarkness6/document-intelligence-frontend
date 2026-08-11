import type { AskDocumentResponse, DocumentQuestion } from "~/types/document";

export const useDocumentChat = () => {
  const api = useApi();

  const getQuestions = (documentId: number) => {
    return api<DocumentQuestion[]>(`/documents/${documentId}/questions`);
  };

  const askQuestion = (documentId: number, question: string) => {
    return api<AskDocumentResponse>(`/documents/${documentId}/ask`, {
      method: "POST",
      body: {
        question,
      },
    });
  };

  return {
    getQuestions,
    askQuestion,
  };
};
