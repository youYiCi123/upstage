import { defineStore } from "pinia";

export const useFileStore = defineStore('fileStore', {
    state: () => ({
        teamFlag:false,
        topFileId:-1,
        //企业
        parentId: 1,
        defaultParentId: 1,
        defaultParentFilename: '',
        //部门
        parentDepId: -1,
        defaultParentDepId: -1,
        defaultParentDepFilename: '',
        multipleSelection: new Array(),
        fileTypes: '-1'
    }),
    actions: {
        setTeamFalg() {
            this.teamFlag = !this.teamFlag
        },
        setFileParentId(parentId:number) {
            this.parentId = parentId
        },
        refreshFileParentId() {
            this.parentId = this.defaultParentId
        },
        setFileDefaultParentId(defaultParentId:number) {
            this.defaultParentId = defaultParentId
        },
        setDefaultParentFilename(defaultParentFilename:string) {
            this.defaultParentFilename = defaultParentFilename
        },

        setFileDepParentId(parentDepId:number) {
            this.parentDepId = parentDepId
        },
        refreshFileDepParentId() {
            this.parentDepId = this.defaultParentDepId
        },
        setFileDefaultDepParentId(defaultParentDepId:number) {
            this.defaultParentDepId = defaultParentDepId
        },
        setDefaultParentDepFilename(defaultParentDepFilename:string) {
            this.defaultParentDepFilename = defaultParentDepFilename
        },
        
        setMultipleSelection(multipleSelection:any) {
            this.multipleSelection = multipleSelection
        },
        setFileTypes(fileTypes:string) {
            this.fileTypes = fileTypes
        },
        clear() {
            this.parentId = -1
            this.defaultParentId = -1
            this.defaultParentFilename = ''
            this.multipleSelection = new Array()
            this.fileTypes = '-1'
        }
    }
})