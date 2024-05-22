// 菜单
interface MenuMode {
    id?: number;
    parentId?: number;
    createTime: Date;
    title?: string;
    level: number;
    sort?: number|string;
    name: string;
    icon?: string;
    hidden?: number;
}

export default MenuMode;