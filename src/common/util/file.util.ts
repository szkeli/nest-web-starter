import fs from 'node:fs';
import path from 'node:path';
import dayjs from 'dayjs';

/**
 * 获取新文件名
 * @param fileName
 */
export const getNewFileName = (fileName: string) => {
  if (!fileName) {
    return fileName;
  }

  // 获取当前日期和时间
  const now = dayjs();
  const yearMonth = now.format('YYYY-MM');
  const day = now.format('DD');
  const timestamp = now.unix(); // 使用 Unix 时间戳

  // 分割文件名和扩展名
  const newFileNameArr = fileName.split('.');

  // 构建新的文件名
  const newFileName = newFileNameArr.shift() + '_' + timestamp;

  // 构建完整的路径
  const pathSeparator = process.platform === 'win32' ? '\\' : '/';
  const fullPath = `${yearMonth}${pathSeparator}${day}${pathSeparator}${newFileName}`;

  return fullPath;
};
/**
 * 递归创建目录 同步方法
 * @param dirname
 * @returns
 */
export const mkdirsSync = (dirname: string) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};
