export interface SseFrame {
  event: string;
  data: string;
  id?: string;
}

function frameBoundary(buffer: string) {
  const match = /\r\n\r\n|\n\n|\r\r/.exec(buffer);
  if (!match || match.index === undefined) return null;

  return {
    index: match.index,
    length: match[0].length,
  };
}

function parseFrame(rawFrame: string): SseFrame | null {
  let event = "message";
  let id: string | undefined;
  const data: string[] = [];

  for (const line of rawFrame.split(/\r\n|\n|\r/)) {
    if (!line || line.startsWith(":")) continue;

    const separator = line.indexOf(":");
    const field = separator === -1 ? line : line.slice(0, separator);
    let value = separator === -1 ? "" : line.slice(separator + 1);

    if (value.startsWith(" ")) value = value.slice(1);

    if (field === "event") event = value;
    else if (field === "data") data.push(value);
    else if (field === "id" && !value.includes("\0")) id = value;
  }

  if (!data.length) return null;

  return {
    event,
    data: data.join("\n"),
    id,
  };
}

export async function* parseSseStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<SseFrame> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      let boundary = frameBoundary(buffer);

      while (boundary) {
        const rawFrame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary.length);

        const frame = parseFrame(rawFrame);
        if (frame) yield frame;

        boundary = frameBoundary(buffer);
      }

      if (done) break;
    }

    const finalFrame = parseFrame(buffer);
    if (finalFrame) yield finalFrame;
  } finally {
    reader.releaseLock();
  }
}
