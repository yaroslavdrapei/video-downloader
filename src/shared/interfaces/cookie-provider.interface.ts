export interface ICookieProvider {
	get(): Promise<unknown>;
	fetch(): Promise<unknown>;
	expire(): Promise<void>;
}
