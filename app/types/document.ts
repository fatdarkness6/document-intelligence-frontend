export interface DocumentStats {
  total_documents: number;
  pdf_documents: number;
  docx_documents: number;
  text_documents: number;
  spreadsheet_documents: number;
  processing_documents: number;
  failed_documents: number;
  total_questions: number;
}

export type DocumentStatus = "processing" | "completed" | "failed";

export interface Document {
  id: number;
  filename: string;
  file_type: string;
  size_bytes: number;
  created_at: string;
  status: DocumentStatus;
  summary: string | null;
  is_favorite: boolean;
  folder_id: number | null;
  tags: unknown[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DocumentListParams {
  search?: string;
  favorite?: boolean;
  folder_id?: number;
  tag_id?: number;
  page?: number;
  per_page?: number;
}

export interface DocumentQuestion {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

export interface AskDocumentResponse {
  question: string;
  answer: string;
  sources?: unknown[];
}
