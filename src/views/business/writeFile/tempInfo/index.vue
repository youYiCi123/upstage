<template>
    <el-card class="form-container" shadow="never">
        <el-form :model="TempQu" ref="customForm" label-width="100px" size="default">
            <el-card>
                <h2 style="text-align: center">{{ TempQu.tempName }}</h2>
                <el-divider />
                <el-form-item label="活动主题：" v-if="TempQu.tempType == 2">
                    <el-input v-model="activity.name" placeholder="请输入活动主题" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动地点：" v-if="TempQu.tempType == 2">
                    <el-input v-model="activity.address" type="textarea" :rows="2" placeholder="请输入活动地点" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动日期：" v-if="TempQu.tempType == 2">
                    <el-date-picker v-model="activity.activityTime" type="daterange" start-placeholder="开始时间"
                        end-placeholder="结束时间" range-separator="-" size="default" />
                </el-form-item>
                <el-form-item label="活动组织者：" v-if="TempQu.tempType == 2">
                    <el-cascader clearable v-model="selectUserArray" :options="sendPersonOptions"
                        @change="selectProductCateValue" style="width: 250px">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="参与部门：" v-if="TempQu.tempType == 2">
                    <el-select v-model="activity.depIds" multiple placeholder="请选择部门" clearable>
                        <el-option v-for="item in allDepList" :key="item.id" :label="item.depName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-divider v-if="TempQu.tempType == 2" />
                <!-- 以下为模板选项 -->
                <div v-for="(item, index) in TempQu.quList" :index="index" :key="item.id" class="qu-content">
                    <p>{{ index + 1 }}.{{ item.content }}</p>
                    <!-- 1：评分，2：单选框，3：复选框，4：输入框 -->
                    <div v-if="item.quType == 1">
                        <el-rate size="large" v-model="item.rateValue" />
                    </div>
                    <div v-if="item.quType == 2">
                        <el-radio-group v-model="item.radioValue">
                            <el-radio v-for="an in item.answerList" :label="an.id">
                                {{ an.content }}
                            </el-radio>
                        </el-radio-group>
                    </div>
                    <div v-if="item.quType == 3">
                        <el-checkbox-group v-model="item.checkValue">
                            <el-checkbox v-for="an in item.answerList" :key="an.id" :label="an.id">{{
                                an.content }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div v-if="item.quType == 4">
                        <el-input v-model="item.inputValue" type="textarea" placeholder="请输入活动主题" clearable>
                        </el-input>
                    </div>
                </div>
                <el-form-item>
                    <el-button style="margin-top: 50px;margin-left:17.6%;margin-bottom: 30px" size="default" type="primary"
                        @click="goBack">返回</el-button>
                    <el-button style="margin-top: 50px;margin-left:6.6%;margin-bottom: 30px" size="default" type="primary"
                        @click="doSubmit" :disabled="isView">保存</el-button>
                </el-form-item>
            </el-card>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import TempQuDetailDto from "@/mode/business/Temp";
import { getTempDetail, getTempUserDetail } from "@/api/field"
import { getDepIdToName, fetchListWithChildren } from "@/api/dep"
import { submitSurvey } from "@/api/survey"
import { useUserStore } from "@/store/modules/userStore";
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const allDepList = ref<any[]>([])
const props = defineProps({
    isView: {
        type: Boolean,
        default: true
    }
})

//提交模板信息
const activity = reactive({
    //《----活动模板
    name: '',
    address: '',
    activityTime: [],
    handlerUserId: '',
    depIds: [],
    //----》
    tempId: '',
    tempName: '',
    tempType: 2,
    tempValueSubmitSingerDtos: [] as any[]
})

const survey = reactive({
    tempId: '',
    tempName: '',
    tempType: 1,
    tempValueSubmitSingerDtos: [] as any[]
})

//获取模板内容
const TempQu = reactive({
    tempName: '',
    tempType: 1,
    quList: [] as TempQuDetailDto[]
})
const sendPersonOptions = ref<any>([]) //获取部门下所有人员的级联信息
const selectUserArray = ref<any>([])//级联选择器内容

init()

function init() {
    //获取部门选择器
    getDepSelector()
    //获取部门人员级联关系
    getSendPersonList()
    getTempDetail(route.query.id).then(res => {
        TempQu.tempName = res.data.tempName
        TempQu.tempType = res.data.tempType
        TempQu.quList = res.data.quList
    }).catch(() => {
    })

    // getTempUserDetail({tempId:route.query.id,userId:userStore.id}).then(res => {
    //         TempQu.tempName = res.data.tempName
    //         TempQu.tempType = res.data.tempType
    //         TempQu.quList = res.data.quList
    //     }).catch(() => {
    //     })
}

function getDepSelector() {
    getDepIdToName().then(response => {
        allDepList.value = response.data
    })
}

function getSendPersonList() {
    fetchListWithChildren().then(response => {
        let list = response.data;
        sendPersonOptions.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
                for (let j = 0; j < list[i].userRelationList.length; j++) {
                    children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].id });
                }
            }
            sendPersonOptions.value.push({ label: list[i].depName, value: list[i].depId, children: children });
        }
    });
}

function selectProductCateValue(newValue: any) {
    if (newValue != null) {
        activity.handlerUserId = newValue[1]
    } else {
        activity.handlerUserId = ''
    }
}

// 子找父 子节点信息中没有父节点
function findIndexArray(data: any, id: any) {
    let reductionSelectedUser = [] //重构部门人员级联关系
    const arr = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].children != null && data[i].children.length > 0) {
            for (let j = 0; j < data[i].children.length; j++) {
                if (data[i].children[j].value == id) {
                    arr.push(data[i].value, data[i].children[j].value)
                    reductionSelectedUser = arr
                }
            }
        }
    }
    return reductionSelectedUser;
}

function doSubmit() {
    TempQu.quList.forEach(t => {
        if (t.quType == 1) {//1：评分，2：单选框，3：复选框
            if (TempQu.tempType == 2) {
                activity.tempValueSubmitSingerDtos.push({
                    quId: t.quId, quType: t.quType, rateValue: t.rateValue, radioValue: null, checkValue: null, inputValue: null
                })
            } else {
                survey.tempValueSubmitSingerDtos.push({
                    quId: t.quId, quType: t.quType, rateValue: t.rateValue, radioValue: null, checkValue: null, inputValue: null
                })
            }
        } else if (t.quType == 2) {
            if (TempQu.tempType == 2) {
                activity.tempValueSubmitSingerDtos.push({
                    quId: t.quId, quType: t.quType, rateValue: null, radioValue: t.radioValue, checkValue: null, inputValue: null
                })
            } else {
                survey.tempValueSubmitSingerDtos.push({
                    quId: t.quId, quType: t.quType, rateValue: null, radioValue: t.radioValue, checkValue: null, inputValue: null
                })
            }
        } else if (t.quType == 3) {
            if (TempQu.tempType == 2) {
                activity.tempValueSubmitSingerDtos.push({
                    quId: t.quId, quType: t.quType, rateValue: null, radioValue: null, checkValue: t.checkValue, inputValue: null
                })
            } else {
                survey.tempValueSubmitSingerDtos.push({
                    quId: t.quId, quType: t.quType, rateValue: null, radioValue: null, checkValue: t.checkValue, inputValue: null
                })
            }
        } else {
            if (TempQu.tempType == 2) {
                activity.tempValueSubmitSingerDtos.push({
                    quId: t.quId, quType: t.quType, rateValue: null, radioValue: null, checkValue: null, inputValue: t.inputValue
                })
            } else {
                survey.tempValueSubmitSingerDtos.push({
                    quId: t.quId, quType: t.quType, rateValue: null, radioValue: null, checkValue: null, inputValue: t.inputValue
                })
            }
        }
    })
    if (TempQu.tempType == 2) {

    } else {
        survey.tempId=route.query.id as string
        survey.tempName=TempQu.tempName
        survey.tempType=TempQu.tempType
        submitSurvey(survey).then((res) => {
            ElMessage.success('提交成功')
            router.back()
        }).catch(res => {
            router.back()
        })
    }

}

function goBack() {
    router.back();
}

</script>
<style scoped>
p:first-child {
    margin-top: 1em;
}

.qu-content {

    border-bottom: #eee 1px solid;
    padding-bottom: 10px;

}
</style>