import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ExampleService {
  constructor(readonly prisma: PrismaService) {}

}
