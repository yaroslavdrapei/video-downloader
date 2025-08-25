import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getInfo } from '@/services/api'
import { downloadVideoWithProgress } from '@/services/api'
import type { InfoDto } from '@/types/api'
import { Message } from './Message'
import { Progress } from '@/components/ui/progress'
import { FetchingDots } from '@/components/ui/fetching-dots'

type VideoFormProps = {
  onInfoLoaded?: (info: InfoDto) => void
}

export function VideoForm({ onInfoLoaded }: VideoFormProps) {
  const [url, setUrl] = React.useState('')
  const [loadingInfo, setLoadingInfo] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)
  const [formats, setFormats] = React.useState<InfoDto['formats']>([])
  const [selectedFormat, setSelectedFormat] = React.useState<string>('')
  const [message, setMessage] = React.useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [title, setTitle] = React.useState<string>('')
  const [thumb, setThumb] = React.useState<string | undefined>()
  type DownloadItem = {
    id: string
    title: string
    formatId: string
    formatLabel: string
    loadedBytes: number
    totalBytes?: number
    isWaitingForFirstByte: boolean
    completed?: boolean
  }
  const [downloads, setDownloads] = React.useState<DownloadItem[]>([])
  const [isDownloadDisabled, setIsDownloadDisabled] = React.useState<boolean>(false)

  const infoAbortRef = React.useRef<AbortController | null>(null)
  const postFormRef = React.useRef<HTMLFormElement | null>(null)

  async function handleFetchInfo(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!url) return
    infoAbortRef.current?.abort()
    infoAbortRef.current = new AbortController()
    setLoadingInfo(true)
    try {
      const info = await getInfo(url, infoAbortRef.current.signal)
      setFormats(info.formats ?? [])
      setSelectedFormat(info.formats?.[0]?.id ?? '')
      setTitle(info.title)
      setThumb(info.thumbnailUrl)
      onInfoLoaded?.(info)
      // Re-enable Download button when new formats are fetched
      setIsDownloadDisabled(false)
    } catch (err) {
      setFormats([])
      setSelectedFormat('')
      setMessage({ kind: 'error', text: (err as Error).message || 'Failed to load info' })
    } finally {
      setLoadingInfo(false)
    }
  }

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!url || !selectedFormat) return
    // Enforce max 4 concurrent downloads
    const activeCount = downloads.filter((d) => !d.completed).length
    if (activeCount >= 4) {
      setMessage({ kind: 'info', text: 'Limit reached: finish or wait for current downloads.' })
      return
    }
    setDownloading(true)
    setIsDownloadDisabled(true)
    const selected = formats.find((f) => f.id === selectedFormat)
    const estimatedTotal = selected?.filesize
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const item: DownloadItem = {
      id,
      title: title || 'video',
      formatId: selectedFormat,
      formatLabel: selected ? formatLabel(selected) : selectedFormat,
      loadedBytes: 0,
      totalBytes: estimatedTotal,
      isWaitingForFirstByte: true,
      completed: false,
    }
    setDownloads((prev) => [...prev, item])
    try {
      // Use a dedicated AbortController for this download only to allow concurrent downloads
      const downloadController = new AbortController()
      const { blob, filename } = await downloadVideoWithProgress(
        { link: url, formatId: selectedFormat },
        (loaded, total) => {
          setDownloads((prev) =>
            prev.map((d) =>
              d.id === id
                ? {
                    ...d,
                    loadedBytes: loaded,
                    totalBytes: total ?? estimatedTotal,
                    isWaitingForFirstByte: loaded <= 0,
                  }
                : d
            )
          )
        },
        downloadController.signal
      )
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      const fromHeader = filename?.trim()
      if (fromHeader) {
        a.download = fromHeader
      } else {
        const safeTitle = title ? title.replace(/[^a-z0-9-_]+/gi, '_').slice(0, 80) : 'video'
        a.download = `${safeTitle}.${guessExtFromFormat(formats, selectedFormat)}`
      }
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
      setDownloads((prev) =>
        prev.map((d) => (d.id === id ? { ...d, completed: true, loadedBytes: d.totalBytes ?? d.loadedBytes } : d))
      )
    } catch (err) {
      setMessage({ kind: 'error', text: (err as Error).message || 'Failed to download' })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <form onSubmit={handleFetchInfo} className="space-y-3">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm text-gray-300">Video URL</label>
          <Input
            id="url"
            placeholder="Paste video URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loadingInfo}>
            {loadingInfo ? 'Loading…' : 'Get Info'}
          </Button>
          {title && <span className="text-sm text-gray-400 truncate">{title}</span>}
        </div>
      </form>

      {thumb && (
        <div className="flex items-center gap-3">
          <img src={thumb} alt="thumbnail" className="h-16 w-28 object-cover rounded" />
          <div className="text-xs text-gray-400">Preview</div>
        </div>
      )}

      <form onSubmit={handleDownload} className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Format</label>
          <Select
            value={selectedFormat}
            onValueChange={(val) => {
              setSelectedFormat(val)
              // Re-enable Download button when user changes format
              setIsDownloadDisabled(false)
            }}
            disabled={!formats?.length}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a format" />
            </SelectTrigger>
            <SelectContent>
              {formats?.length ? formats.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {formatLabel(f)}
                </SelectItem>
              )) : null}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={!selectedFormat || isDownloadDisabled || downloads.filter(d => !d.completed).length >= 4}>
          Download
        </Button>
      </form>

      {downloads.length > 0 && (
        <div className="space-y-3">
          {downloads.map((d) => (
            <div key={d.id} className="space-y-1">
              <div className="text-xs text-gray-400 truncate">{d.title} — {d.formatLabel}</div>
              {d.isWaitingForFirstByte ? (
                <div className="rounded-md border border-yellow-600 bg-yellow-900/30 p-3">
                  <FetchingDots label="Fetching video" />
                </div>
              ) : (
                <Progress
                  value={
                    d.totalBytes && d.totalBytes > 0
                      ? Math.min(100, Math.max(0, (d.loadedBytes / d.totalBytes) * 100))
                      : undefined
                  }
                  label={
                    d.totalBytes && d.totalBytes > 0
                      ? `${humanFileSize(d.loadedBytes)} / ${humanFileSize(d.totalBytes)}`
                      : `${humanFileSize(d.loadedBytes)} downloaded`
                  }
                />
              )}
              {d.completed && (
                <Message kind="success">Download complete.</Message>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Legacy hidden form remains for potential fallback; currently unused */}

      {message && <Message kind={message.kind}>{message.text}</Message>}
    </div>
  )
}

function formatLabel(f: InfoDto['formats'][number]) {
  const parts = [
    f.ext?.toUpperCase(),
    f.resolution,
    f.vcodec && f.vcodec !== 'none' ? `v:${f.vcodec}` : undefined,
    f.acodec && f.acodec !== 'none' ? `a:${f.acodec}` : undefined,
    f.filesize ? humanFileSize(f.filesize) : undefined,
  ].filter(Boolean)
  return parts.join(' · ')
}

function humanFileSize(bytes: number) {
  const thresh = 1024
  if (Math.abs(bytes) < thresh) return bytes + ' B'
  const units = ['KB', 'MB', 'GB', 'TB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
}

function guessExtFromFormat(formats: InfoDto['formats'], id: string) {
  const found = formats.find((f) => f.id === id)
  return (found?.ext || 'mp4').toLowerCase()
}


