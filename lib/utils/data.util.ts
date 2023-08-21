export class DataUtil {
  static toBool(value): boolean {
    if (typeof value === 'boolean') {
      return Boolean(value);
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value.toLowerCase() === '1';
    }
    if (typeof value === 'number') {
      return value >= 1;
    }
    return false;
  }

  static toArray<T>(value): T[] {
    if (!value) {
      return null;
    }
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const substrings = value.split(',');
      return substrings as unknown as T[];
    }
    return [value];
  }
}
