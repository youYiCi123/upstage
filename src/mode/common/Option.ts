interface optionsMode {
  label: number;
  value: number;
}

export interface selectCommonMode {
  id: number;
  name: string;
}

export interface CommonMode extends optionsMode {
  children?: Array<CommonMode>;
}
