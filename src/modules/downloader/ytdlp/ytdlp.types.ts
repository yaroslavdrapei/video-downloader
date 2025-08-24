import { VideoInfo } from 'ytdlp-nodejs';

export type YtdlpInfo = VideoInfo;
export type YtdlpFormat = YtdlpInfo['formats'][number];
