import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NoAuth } from './common/decorators/auth.decorator';
import { AccountFreezeException } from './common/exceptions/auth.exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @NoAuth()
  getHello(): string {
    return this.appService.getHello();
  }
}
