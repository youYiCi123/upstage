import MenuMode from "@/mode/UserInfo/MenuMode";

export interface MenuNodeMode extends MenuMode {
    children?: Array<MenuNodeMode>;
  }