import type {
  Document,
  DocumentListParams,
  DocumentStats,
  PaginatedResponse,
} from "~/types/document";

export const useDocuments = () => {
  const api = useApi();

  const getStats = () => {
    return api<DocumentStats>("/documents/stats");
  };

  const getDocuments = (params: DocumentListParams = {}) => {
    return api<PaginatedResponse<Document>>("/documents", {
      query: params,
    });
  };

  const uploadDocument = (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    return api<Document>("/documents/upload", {
      method: "POST",
      body: formData,
    });
  };

  const getDocument = (id: number) => {
    return api<Document>(`/documents/${id}`);
  };

  const renameDocument = (id: number, filename: string) => {
    return api<Document>(`/documents/${id}`, {
      method: "PATCH",
      body: { filename },
    });
  };

  const toggleFavorite = (id: number, isFavorite: boolean) => {
    return api<Document>(`/documents/${id}/favorite`, {
      method: "PATCH",
      body: {
        is_favorite: isFavorite,
      },
    });
  };

  const deleteDocument = (id: number) => {
    return api<void>(`/documents/${id}`, {
      method: "DELETE",
    });
  };

  const reprocessDocument = (id: number) => {
    return api<{
      message: string;
      document_id: number;
      status: "processing";
    }>(`/documents/${id}/reprocess`, {
      method: "POST",
    });
  };

  const moveToFolder = (id: number, folderId: number | null) => {
    return api<Document>(`/documents/${id}/folder`, {
      method: "PATCH",
      body: {
        folder_id: folderId,
      },
    });
  };

  const addTag = (documentId: number, tagId: number) => {
    return api<Document>(`/documents/${documentId}/tags`, {
      method: "POST",
      body: {
        tag_id: tagId,
      },
    });
  };

  const removeTag = (documentId: number, tagId: number) => {
    return api<Document>(`/documents/${documentId}/tags/${tagId}`, {
      method: "DELETE",
    });
  };

  const downloadReport = (id: number) => {
    return api<Blob>(`/documents/${id}/report`, {
      responseType: "blob",
    });
  };
  return {
    getStats,
    getDocuments,
    getDocument,
    uploadDocument,
    moveToFolder,
    renameDocument,
    toggleFavorite,
    deleteDocument,
    reprocessDocument,
    removeTag,
    addTag,
    downloadReport,
  };
};
