function All() {}
import { ref} from 'vue';
All.prototype = {
    arrToStr(arr:any) {
        if (arr) {
            return arr.map((item:any) => { return item.label }).toString()
        }
    },
    //用于显示选中状态
    toggleClass(arr:any, elem:any, key = 'id') {
        return arr.some((item:any) => { return item[key] == elem[key] });
    },
    toChecked(arr:any, elem:any, key = 'id') {
        var isIncludes = this.toggleClass(arr, elem, key);
        !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
    },
    removeEle(arr:any, elem:any, key = 'id') {
        var includesIndex;
        arr.map((item:any, index:any) => {
            if (item[key] == elem[key]) {
                includesIndex = index
            }
        });
        arr.splice(includesIndex, 1);
        console.log('arr1',arr)
    },
    setApproverStr(nodeConfig:any) {
        if (nodeConfig.setType == 1) {
            //
            if (nodeConfig.nodeUserList.length == 1) {
                return nodeConfig.nodeUserList[0].label
            }else{
                if (nodeConfig.examineMode == 1) {
                    return this.arrToStr(nodeConfig.nodeUserList)
                } else if (nodeConfig.examineMode == 2) {
                    return nodeConfig.nodeUserList.length + "人会签"
                }
            }
        } else if (nodeConfig.setType == 2) {
            let level = '直接主管'
            if (nodeConfig.examineMode == 1) {
                return level
            } else if (nodeConfig.examineMode == 2) {
                return level + "会签"
            }
        } else if (nodeConfig.setType == 4) {
            if (nodeConfig.selectRange == 1) {
                return "发起人自选"
            } else {
                if (nodeConfig.nodeUserList.length > 0) {
                    if (nodeConfig.selectRange == 2) {
                        return "发起人自选"
                    } else {
                        return '发起人从' + nodeConfig.nodeUserList[0].label + '中自选'
                    }
                } else {
                    return "";
                }
            }
        }
    },
    dealStr(str:any, obj:any) {
        const arr = ref<any>([])
        let list = str.split(",");
        for (var elem in obj) {
            list.map((item:any) => {
                if (item == elem) {
                    arr.value.push(obj[elem].value)
                }
            })
        }
        return arr.value.join("或")
    },  
    conditionStr(nodeConfig:any, index:number) {
        var { conditionList, nodeUserList } = nodeConfig.conditionNodes[index];
        if (conditionList.length == 0) {
            return (index == nodeConfig.conditionNodes.length - 1) && nodeConfig.conditionNodes[0].conditionList.length != 0 ? '其他条件进入此流程' : '请设置条件'
        } else {
            let str = ""
            for (var i = 0; i < conditionList.length; i++) {
                var { columnId, columnType, showType, showName, optType, zdy1, opt1, zdy2, opt2, fixedDownBoxValue } = conditionList[i];
                if (columnId == 0) {
                    if (nodeUserList.length != 0) {
                        str += '发起人属于：'
                        str += nodeUserList.map((item:any) => { return item.label }).join("或") + " 并且 "
                    }
                }
                if (columnType == "String" && showType == "3") {
                    if (zdy1) {
                        str += showName + '属于：' + this.dealStr(zdy1, JSON.parse(fixedDownBoxValue)) + " 并且 "
                    }
                }
                if (columnType == "Double") {
                    if (optType != 6 && zdy1) {
                        var optTypeStr = ["", "<", ">", "≤", "=", "≥"][optType]
                        str += `${showName} ${optTypeStr} ${zdy1} 并且 `
                    } else if (optType == 6 && zdy1 && zdy2) {
                        str += `${zdy1} ${opt1} ${showName} ${opt2} ${zdy2} 并且 `
                    }
                }
            }
            return str ? str.substring(0, str.length - 4) : '请设置条件'
        }
    },
    copyerStr(nodeConfig:any) {
        if (nodeConfig.nodeUserList.length != 0) {
            return this.arrToStr(nodeConfig.nodeUserList)
        } else {
            if (nodeConfig.ccSelfSelectFlag == 1) {
                return "发起人自选"
            }
        }
    }, 
    toggleStrClass(item:any, key:any) {
        let a = item.zdy1 ? item.zdy1.split(",") : []
        return a.some((item:any) => { return item == key });
    },
}

export default new (All as any)();