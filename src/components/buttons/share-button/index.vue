<template>
    <div class="rename-button-content">
        <el-button v-if="roundFlag" :icon="Postcard" type="primary" :size="size" round @click="renameFile">
            分享给
        </el-button>
        <el-button v-if="circleFlag" :icon="Postcard" type="primary" :size="size" circle @click="renameFile">
        </el-button>
        <el-dialog title="请选择部门或人员" v-model="fileInfoDialogVisible" width="47%" :append-to-body=true
            :modal-append-to-body=false :center=true>
            <el-form label-width="140px" :model="remindInfo">
                <el-form-item label="选择人员：">
                    <el-cascader clearable v-model="selectUserArray" :options="sendPersonOptions" @change="selectValue"
                        style="width: 250px" :props="cascaderProps" collapse-tags collapse-tags-tooltip>
                    </el-cascader>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { Postcard } from '@element-plus/icons-vue'
import { fetchListWithChildren } from '@/api/dep';
import { ref, reactive } from 'vue'

const cascaderProps = { multiple: true }

const props = defineProps({
    roundFlag: {
        type: Boolean,
        default: false
    },
    circleFlag: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: ''
    },
    item: {
        type: Object,
        default: null,
    },
})
const remindInfo = reactive({
    remindPersonEmail: ''
})

const sendPersonOptions = ref<any>([]) //获取部门下所有人员的级联信息
const selectUserArray = ref<any>([])//级联选择器内容
const fileInfoDialogVisible = ref(false);

function selectValue(newValue: any) {
    if (newValue != null) {
        remindInfo.remindPersonEmail = newValue[1]
    } else {
        remindInfo.remindPersonEmail = ''
    }
}

function renameFile() {
    getSendPersonList()
    fileInfoDialogVisible.value = true
}
function getSendPersonList() {
    fetchListWithChildren().then(response => {
        let list = response.data;
        sendPersonOptions.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
                for (let j = 0; j < list[i].userRelationList.length; j++) {
                    children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].email });
                }
            }
            sendPersonOptions.value.push({ label: list[i].depName, value: list[i].depId, children: children });
        }
        console.log('sendPersonOptions.value', sendPersonOptions.value)
    });
}

</script>

<style>
.rename-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>