export interface ProductCateMode {
  id: number;
  parentId: number;//上机分类的编号：0表示一级分类
  name: string;
  level: number;//分类级别：0->1级；1->2级
  productCount: number;
  productUnit: string;
  navStatus: number;//是否显示在导航栏：0->不显示；1->显示
  showStatus: number;// 显示状态：0->不显示；1->显示
  sort: number;
  icon: string;//图标
  keywords: string;
  description: string;//描述
}
