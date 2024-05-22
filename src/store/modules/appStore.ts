import Cookies from "js-cookie";
import { defineStore } from "pinia";

export const useAppStore = defineStore("appStore", {
  state: () => ({
    sidebar: {
      opened: !Cookies.get("sidebarStatus"),
      withoutAnimation: false,
    },
    
    device: "desktop",
  }),
  actions: {
    toggleSidebar(){
      if (this.sidebar.opened) {
        Cookies.set("sidebarStatus", '1');
      } else {
        Cookies.set("sidebarStatus", '0');
      }
      this.sidebar.opened = !this.sidebar.opened;
    },
    closeSidebar(withoutAnimation:boolean){
      Cookies.set("sidebarStatus", '1');
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;
    },
    toggleDevice(device:string){
      this.device = device;
    },

  }
});