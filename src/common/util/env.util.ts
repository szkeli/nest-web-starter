/**
 * 基础类型接口
 */
export type BaseType = boolean | number | string | undefined | null;

/**
 * 格式化环境变量
 * @param key 环境变量的键值
 * @param defaultValue 默认值
 * @param callback 格式化函数
 */
function formatValue<T extends BaseType = string>(
  key: string,
  defaultValue: T,
  callback?: (value: string) => T,
): T {
  const value: string | undefined = process.env[key];
  if (typeof value === 'undefined') return defaultValue;

  if (!callback) return value as unknown as T;

  return callback(value);
}

/**
 * 读取环境变量
 * @param key
 * @param defaultValue
 */
export function env(key: string, defaultValue: string = ''): string {
  return formatValue(key, defaultValue);
}

/**
 * 读取环境变量，并转换为数字
 * @param key
 * @param defaultValue
 */
export function envNumber(key: string, defaultValue: number = 0): number {
  return formatValue(key, defaultValue, (value) => {
    try {
      return Number(value);
    } catch {
      throw new Error(`${key} environment variable is not a number`);
    }
  });
}

/**
 * 读取环境变量，并转换为布尔值
 * @param key
 * @param defaultValue
 */
export function envBoolean(
  key: string,
  defaultValue: boolean = false,
): boolean {
  return formatValue(key, defaultValue, (value) => {
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`${key} environment variable is not a boolean`);
    }
  });
}
