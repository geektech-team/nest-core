export interface EnumItem {
  value: string | number; // 枚举值
  display: string; // 名称
  alias?: number; // 别名
}

export class EnumModel {
  constructor(private enums: EnumItem[] = []) {
    enums.forEach(({ value, display, alias }) => {
      this.addEnum(value, display, alias);
    });
  }

  addEnum(value: string | number, display: string, alias?: number) {
    if (!this.getEnum(value)) this.enums.push({ value, display, alias });
  }

  getEnum(enumValue: string | number) {
    return this.enums.find(({ value }) => value === enumValue) || null;
  }

  displayOf(enumValue: string | number, defaultDisplay = '') {
    const enumItem = this.getEnum(enumValue);
    return enumItem?.display ?? defaultDisplay;
  }

  getEnumValues() {
    return this.enums.map(({ value }) => value);
  }

  getEnums() {
    return this.enums.map((item) => item);
  }
}
