export type InfoDto = {
  title: string;
  link: string;
  thumbnailUrl?: string;
  formats: Array<{
    id: string;
    ext?: string;
    filesize?: number;
    resolution?: string;
    vcodec?: string;
    acodec?: string;
  }>;
};

export type DownloadVideoRequestDto = {
  link: string;
  formatId: string;
};
