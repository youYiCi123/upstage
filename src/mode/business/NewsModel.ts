export interface NewsTable{
    id:number;
    theme:string;
    createdTime:Date;
    createdAdminName:string;
}

export interface NewsInfo{
    trainId:number;
    theme:string;//主题
    pic:string;//封面
    introduce:string;//简介
    content:string;//主题内容
}