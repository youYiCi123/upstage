export interface ProdInfo {
  id: number;
  brandId: number | null;
  productCategoryId: number | null;
  feightTemplateId: number;
  productAttributeCategoryId: number | null;
  name: string;
  pic: string;
  productSn: string;
  deleteStatus: number;
  publishStatus: number;
  newStatus: number;
  recommandStatus: number;
  verifyStatus: number;
  sort: number;
  sale: number;
  price: number; //bigDecimal //BigDecimal
  promotionPrice: number; //bigDecimal //BigDecimal
  giftGrowth: number;
  giftPoint: number;
  usePointLimit: number;
  subTitle: string;
  originalPrice: number; //bigDecimal //BigDecimal
  stock: number;
  lowStock: number;
  unit: string;
  weight: number; //bigDecimal //BigDecimal
  previewStatus: number;
  serviceIds: string;
  keywords: string;
  note: string;
  albumPics: string;
  detailTitle: string;
  promotionStartTime: Date;
  promotionEndTime: Date;
  promotionPerLimit: number;
  promotionType: number;
  brandName: string;
  productCategoryName: string | null;
  description: string;
  detailDesc: string;
  detailHtml: string;
  detailMobileHtml: string;
  productLadderList: Array<PmsProductLadder>;
  productFullReductionList: Array<PmsProductFullReduction>;
  memberPriceList: Array<PmsMemberPrice>;
  skuStockList: Array<PmsSkuStock>;
  productAttributeValueList: Array<PmsProductAttributeValue>;
  subjectProductRelationList: Array<CmsSubjectProductRelation>;
  prefrenceAreaProductRelationList: Array<CmsPrefrenceAreaProductRelation>;
  cateParentId: number;
}
//商品阶梯价格设置
export interface PmsProductLadder {
  id?: number;
  productId?: number;
  count: number;
  discount: number; //bigDecimal
  price: number; //bigDecimal
}
//商品满减价格设置
export interface PmsProductFullReduction {
  id?: number;
  productId?: number;
  fullPrice: number; //bigDecimal
  reducePrice: number; //bigDecimal
}
//商品会员价格设置
export interface PmsMemberPrice {
  id?: number;
  productId?: number;
  memberLevelId: number;
  memberPrice?: number; //bigDecimal
  memberLevelName: string;
}
//商品的sku库存信息
export interface PmsSkuStock {
  id?: number;
  productId?: number;
  skuCode?: string;
  price?: number; //bigDecimal
  stock?: number;
  lowStock?: number;
  pic?: string;
  sale?: number;
  promotionPrice?: number; //bigDecimal
  lockStock?: number;
  spData: string;
}
//商品参数及自定义规格属性
export interface PmsProductAttributeValue {
  id?: number;
  productId?: number;
  productAttributeId: number;
  value: string;
}
//专题和商品关系
export interface CmsSubjectProductRelation {
  id?: number;
  subjectId: number;
  productId?: number;
}
//优选专区和商品的关系
export interface CmsPrefrenceAreaProductRelation {
  id?: number;
  prefrenceAreaId: number;
  productId?: number;
}
//商品简要信息
export interface ProdBrief {
  id: number;
  brandId: number | null;
  productCategoryId: number | null;
  feightTemplateId: number;
  productAttributeCategoryId: number | null;
  name: string;
  pic: string;
  productSn: string;
  deleteStatus: number;
  publishStatus: number;
  newStatus: number;
  recommandStatus: number;
  verifyStatus: number;
  sort: number;
  sale: number;
  price: number; //bigDecimal //BigDecimal
  promotionPrice: number; //bigDecimal //BigDecimal
  giftGrowth: number;
  giftPoint: number;
  usePointLimit: number;
  subTitle: string;
  originalPrice: number; //bigDecimal //BigDecimal
  stock: number;
  lowStock: number;
  unit: string;
  weight: number; //bigDecimal //BigDecimal
  previewStatus: number;
  serviceIds: string;
  keywords: string;
  note: string;
  albumPics: string;
  detailTitle: string;
  promotionStartTime: Date;
  promotionEndTime: Date;
  promotionPerLimit: number;
  promotionType: number;
  brandName: string;
  productCategoryName: string | null;
  description: string;
  detailDesc: string;
  detailHtml: string;
  detailMobileHtml: string;
}
