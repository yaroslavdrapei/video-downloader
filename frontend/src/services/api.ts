import type { DownloadVideoRequestDto, InfoDto } from '@/types/api';

const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

export async function getInfo(link: string, signal?: AbortSignal): Promise<InfoDto> {
  const url = new URL('/api/info', window.location.origin);
  url.searchParams.set('link', link);
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Request failed');
    throw new Error(text || `Failed to fetch info: ${res.status}`);
  }
  return res.json() as Promise<InfoDto>;
}

export async function downloadVideo(body: DownloadVideoRequestDto, signal?: AbortSignal): Promise<Blob> {
  const res = await fetch('/api/download', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
    signal
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Request failed');
    throw new Error(text || `Failed to download: ${res.status}`);
  }
  // API returns application/octet-stream (201)
  return res.blob();
}

export type DownloadResult = { blob: Blob; filename?: string };

export async function downloadVideoWithProgress(
  body: DownloadVideoRequestDto,
  onProgress: (loadedBytes: number, totalBytes?: number) => void,
  signal?: AbortSignal
): Promise<DownloadResult> {
  const res = await fetch('/api/download', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
    signal
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Request failed');
    throw new Error(text || `Failed to download: ${res.status}`);
  }

  const contentLengthHeader = res.headers.get('content-length');
  const totalBytes = contentLengthHeader ? Number(contentLengthHeader) : undefined;
  const contentDisposition = res.headers.get('content-disposition') || undefined;
  const filename = contentDisposition ? parseFilenameFromContentDisposition(contentDisposition) : undefined;

  if (!res.body) {
    const blob = await res.blob();
    onProgress(totalBytes ?? 0, totalBytes);
    return { blob, filename };
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.byteLength;
      onProgress(received, totalBytes);
    }
  }

  const blob = new Blob(chunks as BlobPart[]);
  return { blob, filename };
}

function parseFilenameFromContentDisposition(header: string): string | undefined {
  // Examples:
  // attachment; filename="video.mp4"
  // attachment; filename*=UTF-8''video%20name.mp4
  const filenameStarMatch = header.match(/filename\*=([^']*)''([^;]+)/i);
  if (filenameStarMatch && typeof filenameStarMatch[2] === 'string') {
    const encoded = filenameStarMatch[2];
    try {
      return decodeURIComponent(encoded);
    } catch {
      return encoded;
    }
  }
  const filenameMatch = header.match(/filename="?([^";]+)"?/i);
  if (filenameMatch) {
    return filenameMatch[1];
  }
  return undefined;
}
