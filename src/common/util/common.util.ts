/**
 * Convert tag string to tag object
 * @param str
 */
export const convertTagStr2TagObj = (str?: string) => {
  if (!str) return {};
  const parts = str.split(';');
  const data: Record<string, string> = {};
  for (const part of parts) {
    const [label, order] = part.split(':');
    data[label] = order;
  }
  return data;
};
