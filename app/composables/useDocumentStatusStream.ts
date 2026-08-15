import type {
  DocumentStatus,
  DocumentStatusEventName,
  DocumentStatusEventPayload,
} from "~/types/document";
import { parseSseStream } from "~/utils/parseSseStream";

interface StreamEvent {
  event: DocumentStatusEventName;
  eventId?: string;
  payload: DocumentStatusEventPayload;
}

interface StreamOptions {
  documentId: number;
  signal: AbortSignal;
  lastEventId?: string;
  onOpen?: () => void;
  onEvent: (event: StreamEvent) => void | Promise<void>;
}

export class DocumentStatusStreamError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "DocumentStatusStreamError";
  }
}

const statusValues = new Set<DocumentStatus>([
  "processing",
  "completed",
  "failed",
]);

const streamEvents = new Set<DocumentStatusEventName>([
  "status",
  "completed",
  "failed",
]);

function isStatusPayload(
  value: unknown,
  documentId: number,
): value is DocumentStatusEventPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Partial<DocumentStatusEventPayload>;

  return (
    payload.document_id === documentId &&
    typeof payload.status === "string" &&
    statusValues.has(payload.status as DocumentStatus) &&
    typeof payload.stage === "string" &&
    typeof payload.message === "string" &&
    typeof payload.updated_at === "string" &&
    (payload.progress === undefined ||
      payload.progress === null ||
      typeof payload.progress === "number")
  );
}

export const useDocumentStatusStream = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const streamUrl = (documentId: number) => {
    const baseUrl = String(config.public.apiBase || "").replace(/\/$/, "");
    return `${baseUrl}/documents/${documentId}/events`;
  };

  async function connect(options: StreamOptions) {
    const accessToken = authStore.accessToken;

    if (!accessToken) {
      throw new DocumentStatusStreamError("Authentication is required.", 401);
    }

    const headers = new Headers({
      Accept: "text/event-stream",
      Authorization: `Bearer ${accessToken}`,
    });

    if (options.lastEventId) {
      headers.set("Last-Event-ID", options.lastEventId);
    }

    const response = await fetch(streamUrl(options.documentId), {
      method: "GET",
      headers,
      signal: options.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new DocumentStatusStreamError(
        `Unable to subscribe to document updates (${response.status}).`,
        response.status,
      );
    }

    if (!response.body) {
      throw new DocumentStatusStreamError(
        "The document update stream has no response body.",
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("text/event-stream")) {
      throw new DocumentStatusStreamError(
        "The document update endpoint returned an invalid content type.",
      );
    }

    options.onOpen?.();

    for await (const frame of parseSseStream(response.body)) {
      if (frame.event === "ping") continue;
      if (!streamEvents.has(frame.event as DocumentStatusEventName)) continue;

      let payload: unknown;

      try {
        payload = JSON.parse(frame.data);
      } catch {
        continue;
      }

      if (!isStatusPayload(payload, options.documentId)) continue;

      await options.onEvent({
        event: frame.event as DocumentStatusEventName,
        eventId: frame.id,
        payload,
      });
    }
  }

  return {
    connect,
  };
};
