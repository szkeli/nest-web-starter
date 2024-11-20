import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { NoAuth } from '../../common/decorators/auth.decorator';
import { ResultDto } from '../../common/dto/common.dto';

@Controller('upload')
@ApiTags('文件上传模块')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '通用单文件上传' })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @NoAuth()
  async singleFileUpload(@UploadedFile() file: Express.Multer.File) {
    const res = await this.uploadService.singleFileUpload(file);

    return ResultDto.success(res);
  }
}
