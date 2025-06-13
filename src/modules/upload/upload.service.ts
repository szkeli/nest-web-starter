import { Inject, Injectable } from '@nestjs/common';
import { FileConfig, IFileConfig } from '../../config';
import { FileSizeException } from '../../common/exceptions/file.exception';
import { getNewFileName, mkdirsSync } from '../../common/util/file.util';
import iconv from 'iconv-lite';
import Mime from 'mime-types';
import path from 'path';
import fs from 'fs';

@Injectable()
export class UploadService {
  constructor(@Inject(FileConfig.KEY) readonly fileConfig: IFileConfig) {}

  /**
   * 单文件上传
   * @param file
   */
  async singleFileUpload(file: Express.Multer.File) {
    // 上传文件的大小
    const fileSize = (file.size / 1024 / 1024).toFixed(2);

    if (Number(fileSize) > this.fileConfig.maxSize) {
      throw new FileSizeException();
    }

    const url = await this.saveFileLocal(file);

    return {
      url,
    };
  }

  /**
   * 保存文件到本地
   * @param file
   */
  async saveFileLocal(file: Express.Multer.File) {
    const rootPath = process.cwd();
    //文件根目录
    const baseDirPath = path.join(rootPath, this.fileConfig.baseDir);

    //对文件名转码
    const originalname = iconv.decode(
      Buffer.from(file.originalname, 'binary'),
      'utf8',
    );
    // 获取文件类型
    const ext = Mime.extension(file.mimetype);
    //重新生成文件名加上时间戳
    const newFileName = getNewFileName(originalname) + '.' + ext;
    //文件路径
    const targetFile = path.join(baseDirPath, newFileName);
    //文件目录
    const sourceFilesDir = path.dirname(targetFile);
    //文件相对地址
    const relativeFilePath = targetFile.replace(baseDirPath, '');

    if (!fs.existsSync(sourceFilesDir)) {
      mkdirsSync(sourceFilesDir);
    }
    fs.writeFileSync(targetFile, file.buffer);

    //文件服务完整路径
    const fileName = path.join(this.fileConfig.staticPrefix, relativeFilePath);
    const url = path.join(this.fileConfig.domain, fileName);
    return url;
  }
}
