import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleController } from './example.controller';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ExampleController],
  imports: [UserModule],
  providers: [ExampleService, PrismaService],
})
export class ExampleModule {}
