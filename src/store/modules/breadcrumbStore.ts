import { defineStore } from "pinia";

export const useBreadcrumbStore = defineStore('breadcrumbStore', {
    state: () => ({
        //企业
        breadCrumbs: new Array(),
        ExpandFlag:false,
        //部门
        depBreadCrumbs: new Array(),
        depExpandFlag:false,
    }),
    actions: {
        //企业
        clear() {
            this.breadCrumbs = new Array()
        },
        addItem(item:any) {
            this.breadCrumbs.push(item)
        },
        reset(newBreadCrumbs:any) {
            this.breadCrumbs = newBreadCrumbs
        },
        resetFlag() {
            this.ExpandFlag=!this.ExpandFlag
        },
        //部门
        clearDep() {
            this.depBreadCrumbs = new Array()
        },
        addDepItem(item:any) {
            this.depBreadCrumbs.push(item)
        },
        resetDep(newBreadCrumbs:any) {
            this.depBreadCrumbs = newBreadCrumbs
        },
        resetDepFlag() {
            this.depExpandFlag=!this.depExpandFlag
        },
    }
})