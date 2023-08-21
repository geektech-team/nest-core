import { EnumItem, EnumModel } from '../models/enum.model';

export class EnumCombination {
  constructor(private enumModel: EnumModel) {}
  getEnumAlias(enumKey: EnumItem['value']): number {
    const enumItem = this.enumModel.getEnum(enumKey);
    if (!enumItem) return 0;
    const enumAliasValue = 2 ** (enumItem.alias as number);
    return enumAliasValue;
  }
  hasEnum(sum: number, enumKey: EnumItem['value']): boolean {
    const enumAliasValue = this.getEnumAlias(enumKey);
    return (sum & enumAliasValue) === enumAliasValue;
  }
  getEnumsSum(enums: EnumItem['value'][]): number {
    let sum = 0;
    enums.forEach((enumKey) => {
      const enumItem = this.enumModel.getEnum(enumKey);
      if (typeof enumItem?.alias === 'number') {
        sum += 2 ** enumItem.alias;
      }
    });
    return sum;
  }
  getEnumsBySum(sum: number): EnumItem[] {
    const enums = this.enumModel
      .getEnums()
      .reduce((list, enumItem: EnumItem) => {
        if (typeof enumItem?.alias === 'number') {
          const enumValue = 2 ** enumItem.alias;
          if ((sum & enumValue) === enumValue) {
            list.push(enumItem);
          }
        }
        return list;
      }, []);
    return enums;
  }
}
