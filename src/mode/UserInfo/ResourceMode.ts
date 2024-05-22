export interface ResourceCateMode {
  id: number;
  name: string;
  sort: number;
  checked?: boolean;
}

export interface ResourceMode {
  id: number;
  name: string;
  url: string;
  description: string;
  categoryId: number;
  checked?: boolean;
}
