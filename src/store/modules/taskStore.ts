import { defineStore } from "pinia";
import panUtil from '@/utils/fileUtil'

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        taskList: new Array(),
        viewFlag: false
    }),
    actions: {
        clear() {
            this.taskList = new Array()
            this.viewFlag = false
        },
        add(taskItem:any) {
            this.taskList.push(taskItem)
        },
        remove(filename:any) {
            for (let i = 0; i < this.taskList.length; i++) {
                if (filename === this.taskList[i].filename) {
                    this.taskList.splice(i, 1)
                    break
                }
            }
        },
        updateStatus(param:any) {
            let taskItem = this.taskList.find(taskItem => param.filename === taskItem.filename)
            taskItem.status = param.status
            taskItem.statusText = param.statusText
        },
        updateProcess(param:any) {
            let taskItem = this.taskList.find(taskItem => param.filename === taskItem.filename)
            taskItem.speed = param.speed
            taskItem.percentage = param.percentage
            taskItem.uploadedSize = param.uploadedSize
            taskItem.timeRemaining = param.timeRemaining
        },
        pause(filename:string|number) {
            let taskItem = this.taskList.find(taskItem => filename === taskItem.filename)
            taskItem.target.pause()
            taskItem.status = panUtil.fileStatus.PAUSE.code
            taskItem.statusText = panUtil.fileStatus.PAUSE.text
        },
        resume(filename:string|number) {
            let taskItem = this.taskList.find(taskItem => filename === taskItem.filename)
            taskItem.target.resume()
        },
        cancel(filename:string|number) {
            for (let i = 0; i < this.taskList.length; i++) {
                if (filename === this.taskList[i].filename) {
                    this.taskList[i].target.cancel()
                    this.taskList.splice(i, 1)
                    if (this.taskList.length === 0) {
                        this.viewFlag = false
                    }
                    break
                }
            }
        },
        retry(filename:string|number) {
            let taskItem = this.taskList.find(taskItem => filename === taskItem.filename)
            taskItem.target.bootstrap()
            taskItem.target.resume()
        },
        updateViewFlag(viewFlag:boolean) {
            this.viewFlag = viewFlag
        },
        changeViewFlag() {
            this.viewFlag = !this.viewFlag
        },
        getUploadTask(filename:string|number){
            return this.taskList.find(taskItem => filename === taskItem.filename)
        },
    }
})