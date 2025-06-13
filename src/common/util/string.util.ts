/**
 * 转换为数字
 * @param value
 * @param defaultValue 默认值
 */
export function formatNumber(value: string, defaultValue: number = 0) {
  try {
    if (!value) return defaultValue;
    return Number(value);
  } catch {
    return defaultValue;
  }
}

/**
 * 转换为布尔值
 * @param value
 * @param defaultValue
 */
export const formatBoolean = (value: string, defaultValue: boolean = false) => {
  try {
    if (!value) return defaultValue;
    return Boolean(JSON.parse(value));
  } catch {
    return defaultValue;
  }
};
