export interface ProductAttrMode {
  id: number;
  name: string;
  selectType: number;
  inputType: number;
  inputList: string;
  sort: number;
}

export interface ProductAttrCateMode {
  id: number;
  name: string;
  attributeCount: number;
  paramCount: number;
}
