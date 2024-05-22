export interface RoleMode {
    id: number;
    name: string;
    // 描述
    description: string;
    // 后台用户数量
    adminCount: number;
    createTime: Date;
    // 启用状态：0->禁用；1->启用
    status: number;
    sort: number;
}

export interface addRoleMode {
    id: number;
    name: string;
    description: string;
    adminCount: number;
    status: number;
}
