import { CookieStatus } from '../enums/cookie-status.enum';

export type Cookie = {
	status: CookieStatus;
	cookie: unknown; // cookies themselves
};
