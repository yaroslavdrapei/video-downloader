import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request, Response } from 'express';
import { DownloadVideoRequestDto } from '@src/dto/request/download-video-request.dto';

@Injectable()
export class DownloaderInterceptor implements NestInterceptor {
	private readonly logger = new Logger(DownloaderInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const http = context.switchToHttp();
		const request = http.getRequest<Request>();
		const { link, formatId } = request.body as DownloadVideoRequestDto;

		const response = http.getResponse<Response>();

		const startTimestampMs = Date.now();
		this.logger.log(`START ${link}, ${formatId}`);

		response.on('finish', () => {
			const endTimestampMs = Date.now();
			const minutes = Math.floor((endTimestampMs - startTimestampMs) / 1000 / 60);
			const seconds = Math.floor((endTimestampMs - startTimestampMs) / 1000);
			this.logger.log(`END ${link}, ${formatId} (+${minutes}m ${seconds}s)`);
		});

		return next.handle();
	}
}
