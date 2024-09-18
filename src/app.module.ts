import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [UserModule, ExampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
