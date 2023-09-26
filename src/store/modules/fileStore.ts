import { defineStore } from "pinia";
import { ElMessage } from 'element-plus';
import {search,list} from '@/api/file'

export const useFileStore = defineStore('fileStore', {
    state: () => ({
        parentId: '',
        defaultParentId: '',
        defaultParentFilename: '',
        fileList: new Array(),
        multipleSelection: new Array(),
        fileTypes: '-1',
        searchFlag: false,
        searchKey: '',
        tableLoading: true
    }),
    actions: {
        setFileParentId(parentId:string) {
            this.parentId = parentId
        },
        refreshFileParentId() {
            this.parentId = this.defaultParentId
        },
        setFileDefaultParentId(defaultParentId:string) {
            this.defaultParentId = defaultParentId
        },
        setDefaultParentFilename(defaultParentFilename:string) {
            this.defaultParentFilename = defaultParentFilename
        },
        setFileList(fileList:any) {
            this.fileList = fileList
        },
        setMultipleSelection(multipleSelection:any) {
            this.multipleSelection = multipleSelection
        },
        setFileTypes(fileTypes:string) {
            this.fileTypes = fileTypes
        },
        setSearchFlag(searchFlag:boolean) {
            if (!searchFlag) {
                this.searchKey = ''
            }
            this.searchFlag = searchFlag
        },
        setSearchKey(searchKey:string) {
            this.searchKey = searchKey
        },
        setTableLoading(tableLoading:boolean) {
            this.tableLoading = tableLoading
        },
        clear() {
            this.parentId = ''
            this.defaultParentId = ''
            this.defaultParentFilename = ''
            this.fileList = new Array()
            this.multipleSelection = new Array()
            this.fileTypes = '-1'
            this.searchFlag = false
            this.searchKey = ''
            this.tableLoading = true
        },
        loadFileList() {
            this.setTableLoading(true)
            if (this.searchFlag) {
                search({
                    keyword: this.searchKey,
                    fileTypes: '-1'
                }).then((res:any)=>{
                    this.setFileList(res.data)
                    this.setTableLoading(false)
                }).catch((res:any)=>{
                    this.setTableLoading(false)
                    ElMessage.error(res.message)
                })
            } else {
                //todo
                list({
                    parentId: this.parentId,
                    fileTypes: this.fileTypes
                }).then((res:any)=>{
                    this.setTableLoading(false)
                    this.setFileList(res.data)
                }).catch((res:any)=>{
                    this.setTableLoading(false)
                    ElMessage.error(res.message)
                })
            }
        }
    }
})