import { Format } from "./format.type";

export type Info = {
	title: string;
	link: string;
	formats: Format[];
	thumbnailUrl?: string;
};
