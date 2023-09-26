import { defineStore } from "pinia";

export const useBreadcrumbStore = defineStore('breadcrumbStore', {
    state: () => ({
        breadCrumbs: new Array()    
    }),
    actions: {
        clear() {
            this.breadCrumbs = new Array()
        },
        addItem(item:any) {
            this.breadCrumbs.push(item)
        },
        reset(newBreadCrumbs:any) {
            this.breadCrumbs = newBreadCrumbs
        }
    }
})