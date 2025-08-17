import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Get('/status')
	getHello(): { message: string } {
		return { message: 'I am up and running' };
	}
}
