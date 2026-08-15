import type { Tag } from "~/types/tag";

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

export type DocumentStatusEventName =
  | "status"
  | "completed"
  | "failed";

export type DocumentStreamConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "waiting-for-network"
  | "error";

export interface DocumentStatusEventPayload {
  document_id: number;
  status: DocumentStatus;
  stage: string;
  progress?: number | null;
  message: string;
  updated_at: string;
}

export interface DocumentProcessingUpdate
  extends DocumentStatusEventPayload {
  event: DocumentStatusEventName;
  event_id?: string;
  received_at: number;
}

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
  tags: Tag[];
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

export interface DocumentSource {
  chunk_id: number;
  chunk_index: number;
  page_number: number | null;
  preview: string;
}

export interface DocumentQuestion {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  sources?: DocumentSource[];
}

export interface AskDocumentResponse {
  answer: string;
  sources: DocumentSource[];
}

export interface SpreadsheetColumnInfo {
  name: string;
  type: string;
  missing_values: number;
}

export interface NumericSummary {
  count: number;
  mean: number | null;
  std: number | null;
  min: number | null;
  "25%": number | null;
  "50%": number | null;
  "75%": number | null;
  max: number | null;
}

export interface SpreadsheetAnalysis {
  rows: number;
  columns: number;
  column_info: SpreadsheetColumnInfo[];
  numeric_summary: Record<string, NumericSummary>;
}

export interface SpreadsheetInsights {
  insights: string;
}
