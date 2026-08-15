import type {
  Document,
  DocumentProcessingUpdate,
  DocumentStatusEventName,
  DocumentStreamConnectionState,
} from "~/types/document";
import { DocumentStatusStreamError } from "~/composables/useDocumentStatusStream";

interface StreamSession {
  documentId: number;
  controller: AbortController | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  reconnectAttempts: number;
  lastEventId?: string;
  fallbackUsed: boolean;
  terminal: boolean;
}

const MAX_RECONNECT_ATTEMPTS = 8;
const MAX_RECONNECT_DELAY = 15_000;

export const useDocumentProcessingStore = defineStore(
  "document-processing",
  () => {
    const updates = ref<Record<number, DocumentProcessingUpdate>>({});
    const connectionStates = ref<
      Record<number, DocumentStreamConnectionState>
    >({});

    const subscriberCounts = new Map<number, number>();
    const sessions = new Map<number, StreamSession>();
    const documentsApi = useDocuments();
    const statusStream = useDocumentStatusStream();
    const authStore = useAuthStore();

    function setConnectionState(
      documentId: number,
      state: DocumentStreamConnectionState,
    ) {
      connectionStates.value[documentId] = state;
    }

    function isTerminal(update: DocumentProcessingUpdate | undefined) {
      return update?.status === "completed" || update?.status === "failed";
    }

    function hasHandledEvent(session: StreamSession, eventId?: string) {
      if (!eventId || !session.lastEventId) return false;

      const previous = Number(session.lastEventId);
      const incoming = Number(eventId);

      if (Number.isFinite(previous) && Number.isFinite(incoming)) {
        return incoming <= previous;
      }

      return eventId === session.lastEventId;
    }

    function publishUpdate(
      session: StreamSession,
      event: DocumentStatusEventName,
      document: Omit<DocumentProcessingUpdate, "event" | "received_at">,
    ) {
      if (hasHandledEvent(session, document.event_id)) return;
      if (document.event_id) session.lastEventId = document.event_id;

      const normalizedEvent: DocumentStatusEventName =
        document.status === "completed"
          ? "completed"
          : document.status === "failed"
            ? "failed"
            : event;

      updates.value[session.documentId] = {
        ...document,
        event: normalizedEvent,
        received_at: Date.now(),
      };

      if (document.status !== "processing") {
        session.terminal = true;
      }
    }

    function updateFromFallback(session: StreamSession, document: Document) {
      const event: DocumentStatusEventName =
        document.status === "completed"
          ? "completed"
          : document.status === "failed"
            ? "failed"
            : "status";

      publishUpdate(session, event, {
        document_id: document.id,
        status: document.status,
        stage: document.status,
        progress: document.status === "completed" ? 100 : null,
        message:
          document.status === "completed"
            ? "Document processing completed"
            : document.status === "failed"
              ? "Document processing failed"
              : "Document processing is in progress",
        updated_at: new Date().toISOString(),
      });
    }

    async function runFallback(session: StreamSession) {
      if (session.fallbackUsed || session.terminal) return;
      session.fallbackUsed = true;

      try {
        const document = await documentsApi.getDocument(session.documentId);
        if (sessions.get(session.documentId) !== session) return;
        updateFromFallback(session, document);
      } catch {
        // The stream reconnection policy handles unavailable fallback requests.
      }
    }

    function reconnectDelay(attempt: number) {
      const exponential = Math.min(
        1_000 * 2 ** Math.max(0, attempt - 1),
        MAX_RECONNECT_DELAY,
      );
      const jitter = Math.round(Math.random() * 400);
      return exponential + jitter;
    }

    function scheduleReconnect(session: StreamSession) {
      if (
        session.terminal ||
        sessions.get(session.documentId) !== session ||
        !subscriberCounts.get(session.documentId)
      ) {
        return;
      }

      if (!navigator.onLine) {
        setConnectionState(session.documentId, "waiting-for-network");
        return;
      }

      if (session.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        setConnectionState(session.documentId, "error");
        return;
      }

      session.reconnectAttempts += 1;
      setConnectionState(session.documentId, "reconnecting");

      session.reconnectTimer = setTimeout(() => {
        session.reconnectTimer = null;
        void connectSession(session);
      }, reconnectDelay(session.reconnectAttempts));
    }

    async function connectSession(session: StreamSession) {
      if (
        !import.meta.client ||
        session.controller ||
        session.terminal ||
        sessions.get(session.documentId) !== session
      ) {
        return;
      }

      if (!navigator.onLine) {
        setConnectionState(session.documentId, "waiting-for-network");
        return;
      }

      const controller = new AbortController();
      let connectedAt: number | null = null;
      session.controller = controller;
      setConnectionState(
        session.documentId,
        session.reconnectAttempts ? "reconnecting" : "connecting",
      );

      try {
        await statusStream.connect({
          documentId: session.documentId,
          lastEventId: session.lastEventId,
          signal: controller.signal,
          onOpen: () => {
            connectedAt = Date.now();
            setConnectionState(session.documentId, "connected");
          },
          onEvent: ({ event, eventId, payload }) => {
            publishUpdate(session, event, {
              ...payload,
              event_id: eventId,
            });
          },
        });

        if (session.terminal) return;
        if (connectedAt && Date.now() - connectedAt >= 60_000) {
          session.reconnectAttempts = 0;
        }
        scheduleReconnect(session);
      } catch (error) {
        if (controller.signal.aborted) return;

        if (error instanceof DocumentStatusStreamError) {
          if (error.status === 401) {
            stopAll();
            authStore.clearAuth();
            await navigateTo("/login");
            return;
          }

          if (error.status === 404) {
            setConnectionState(session.documentId, "error");
            return;
          }
        }

        await runFallback(session);
        if (!session.terminal) scheduleReconnect(session);
      } finally {
        if (session.controller === controller) {
          session.controller = null;
        }
      }
    }

    function subscribe(documentId: number) {
      if (!import.meta.client) return;

      const count = subscriberCounts.get(documentId) ?? 0;
      subscriberCounts.set(documentId, count + 1);

      if (count > 0) return;

      delete updates.value[documentId];

      const session: StreamSession = {
        documentId,
        controller: null,
        reconnectTimer: null,
        reconnectAttempts: 0,
        fallbackUsed: false,
        terminal: false,
      };

      sessions.set(documentId, session);
      void connectSession(session);
    }

    function unsubscribe(documentId: number) {
      if (!import.meta.client) return;

      const count = subscriberCounts.get(documentId) ?? 0;

      if (count > 1) {
        subscriberCounts.set(documentId, count - 1);
        return;
      }

      subscriberCounts.delete(documentId);

      const session = sessions.get(documentId);
      if (session?.reconnectTimer) clearTimeout(session.reconnectTimer);
      session?.controller?.abort();

      sessions.delete(documentId);
      delete connectionStates.value[documentId];
      delete updates.value[documentId];
    }

    function stopAll() {
      for (const session of sessions.values()) {
        if (session.reconnectTimer) clearTimeout(session.reconnectTimer);
        session.controller?.abort();
      }

      sessions.clear();
      subscriberCounts.clear();
      connectionStates.value = {};
      updates.value = {};
    }

    function retry(documentId: number) {
      const session = sessions.get(documentId);
      if (!session || session.terminal) return;

      if (session.reconnectTimer) clearTimeout(session.reconnectTimer);
      session.reconnectTimer = null;

      const activeController = session.controller;
      session.controller = null;
      activeController?.abort();

      session.reconnectAttempts = 0;
      session.fallbackUsed = false;
      setConnectionState(documentId, "connecting");
      void connectSession(session);
    }

    function reconnectWaitingSessions() {
      for (const session of sessions.values()) {
        if (!session.controller && !session.reconnectTimer && !session.terminal) {
          void connectSession(session);
        }
      }
    }

    if (import.meta.client) {
      window.addEventListener("online", reconnectWaitingSessions);

      onScopeDispose(() => {
        window.removeEventListener("online", reconnectWaitingSessions);
        stopAll();
      });
    }

    watch(
      () => authStore.isAuthenticated,
      (isAuthenticated) => {
        if (!isAuthenticated) stopAll();
      },
    );

    return {
      updates,
      connectionStates,
      subscribe,
      unsubscribe,
      retry,
      stopAll,
      isTerminal,
    };
  },
);
