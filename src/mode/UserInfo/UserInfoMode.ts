import MenuMode from "./MenuMode";

export interface UserInfoMode {
    username:string;
    menus:Array<MenuMode>;
}

export interface UserCreateMode{
     username:string;
     sex:number;
      password:string;
      icon:string;
      email:string;
      nickName:string;
      note:string;
      address:string;
      depId:string;
      phoneNumber:string;
}

export interface UserTableMode{
      id:number;
      username:string;
      sex:number;
      password:string;
      icon:string;
      email:string;
      nickName:string;
      depId:any;
      depName:string;
      duty:string;
      phoneNumber:string;
      address:string;
      note:string;
      createTime:Date;
      loginTime:Date;
      status:number;
}